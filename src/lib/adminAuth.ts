import { cookies } from "next/headers";

// Simple in-memory rate limiter for serverless environment (lightweight fallback)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return { success: true, remaining: limit - 1 };
  }

  if (userLimit.count >= limit) {
    return { success: false, remaining: 0 };
  }

  userLimit.count += 1;
  return { success: true, remaining: limit - userLimit.count };
}

/**
 * Validates the admin request.
 * Supports:
 * 1. x-admin-key header
 * 2. Authorization: Bearer <key> header
 * 3. annex_admin_token cookie
 */
export async function verifyAdminSession(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return { 
      authenticated: false, 
      authorized: false, 
      status: 401, 
      error: "Admin credentials are not configured on the server environment." 
    };
  }

  // 1. Check x-admin-key header
  let token = request.headers.get("x-admin-key");

  // 2. Check Authorization header (Bearer token)
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 3. Check Cookie (annex_admin_token)
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("annex_admin_token")?.value || null;
    } catch (e) {
      // Cookies header may not be readable in some edge runtime profiles, fallback to parse headers
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/annex_admin_token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (!token) {
    return { 
      authenticated: false, 
      authorized: false, 
      status: 401, 
      error: "Unauthorized - No credentials provided" 
    };
  }

  if (token !== adminPassword) {
    return { 
      authenticated: true, 
      authorized: false, 
      status: 403, 
      error: "Forbidden - Invalid admin credentials" 
    };
  }

  return { authenticated: true, authorized: true };
}
