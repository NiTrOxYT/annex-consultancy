import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Rate limiter for serverless environment
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

// Client for decoding counselor JWT session tokens on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const authHelperClient = createClient(supabaseUrl, supabaseAnonKey);

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
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/annex_admin_token=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (token) {
    const trimmed = token.trim();
    if (trimmed === "" || trimmed === "null" || trimmed === "undefined") {
      token = null;
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

  // A. Check legacy master admin password
  if (token === adminPassword) {
    return { 
      authenticated: true, 
      authorized: true,
      userType: "super-admin"
    };
  }

  // B. Check if it's a counselor Supabase Auth JWT token
  try {
    const { data: { user }, error: authErr } = await authHelperClient.auth.getUser(token);
    if (authErr || !user) {
      return {
        authenticated: false,
        authorized: false,
        status: 401,
        error: "Forbidden - Invalid session token"
      };
    }

    // Lookup user in counselors table (using admin client to bypass initial query limits)
    const db = supabaseAdmin || authHelperClient;
    const { data: counselor, error: dbErr } = await db
      .from("counselors")
      .select("*, user_roles(name)")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (dbErr || !counselor) {
      return {
        authenticated: true,
        authorized: false,
        status: 403,
        error: "Forbidden - Associated counselor account not found"
      };
    }

    if (!counselor.is_active) {
      return {
        authenticated: true,
        authorized: false,
        status: 403,
        error: "Forbidden - Counselor account is inactive"
      };
    }

    return {
      authenticated: true,
      authorized: true,
      userType: "counselor",
      counselorId: counselor.id,
      roleName: counselor.user_roles?.name || "Counselor",
      counselor
    };
  } catch (err: any) {
    return {
      authenticated: false,
      authorized: false,
      status: 500,
      error: "Session validation error: " + err.message
    };
  }
}

/**
 * Checks if a specific counselor has the requested permission.
 */
export async function verifyCounselorPermission(counselorId: string, permissionKey: string): Promise<boolean> {
  const db = supabaseAdmin;
  if (!db) {
    console.warn("[adminAuth] supabaseAdmin client not configured. Falling back to false.");
    return false;
  }

  try {
    const { data, error } = await db.rpc("has_counselor_permission", {
      c_id: counselorId,
      perm_key: permissionKey
    });

    if (error) {
      console.error("[adminAuth] has_counselor_permission RPC error:", error);
      return false;
    }

    return !!data;
  } catch (e: any) {
    console.error("[adminAuth] Exception during permission validation:", e.message);
    return false;
  }
}
