import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Matcher to target administrative sub-paths (like /admin/students, /admin/settings)
// but skip the login page (/admin) and public assets.
export const config = {
  matcher: ["/admin/:path+"]
};

// Map the tab path segment to its required database permission key
function getRequiredPermissionForTab(tab: string): string | null {
  const mapping: { [key: string]: string } = {
    bookings: "Dashboard",
    students: "Students",
    counselors: "Counselors Management",
    chat: "Messages",
    training: "Training & Placement",
    universities: "Universities",
    blog: "Blog",
    stories: "Success Stories",
    experts: "Training & Placement",
    notifications: "Notifications",
    settings: "Settings",
    roles: "System Administration"
  };
  return mapping[tab] || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the base admin page, login pages, or error assets pass through without checks
  if (
    pathname === "/admin" || 
    pathname === "/admin/login" || 
    pathname === "/admin/access-denied"
  ) {
    return NextResponse.next();
  }

  // 1. Get the admin token cookie
  const token = request.cookies.get("annex_admin_token")?.value;
  if (!token) {
    console.warn(`[Middleware Redirect] Anonymous access attempt to: ${pathname}. Redirecting to login.`);
    return NextResponse.redirect(new URL("/admin?error=unauthorized", request.url));
  }

  // 2. Validate legacy super-admin passkey bypass
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (adminPassword && token === adminPassword) {
    return NextResponse.next();
  }

  // 3. Verify counselor session permissions by calling our server-side API route
  try {
    const origin = request.nextUrl.origin;
    const res = await fetch(`${origin}/api/admin/rbac?action=get-current-user-perms`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.warn(`[Middleware Redirect] Session check failed for token on: ${pathname}`);
      return NextResponse.redirect(new URL("/admin?error=session-invalid", request.url));
    }

    const data = await res.json();
    const userPermissions: string[] = data.permissions || [];

    // Extract the tab/subpath segment (e.g. /admin/students -> students)
    const tabSegment = pathname.split("/").pop() || "";
    const requiredPermission = getRequiredPermissionForTab(tabSegment);

    if (!requiredPermission) {
      // Allow general unmapped pages under /admin to load
      return NextResponse.next();
    }

    if (!userPermissions.includes(requiredPermission)) {
      console.warn(`[Middleware Block] Counselor lacks permission "${requiredPermission}" for: ${pathname}`);
      // Redirect to admin landing with an access-denied code, which the dashboard UI will render cleanly
      return NextResponse.redirect(new URL("/admin?error=access-denied", request.url));
    }

    // Permission check succeeded
    return NextResponse.next();
  } catch (err: any) {
    console.error("[Middleware Exception]:", err.message);
    // Graceful degradation on network/API errors
    return NextResponse.redirect(new URL("/admin?error=server-error", request.url));
  }
}
