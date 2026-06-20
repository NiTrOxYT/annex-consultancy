import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const db = supabaseAdmin || supabase;

// Checklist of all possible system permissions
const ALL_PERMISSIONS = [
  "Dashboard",
  "Students",
  "Career Portal Students",
  "Training & Placement",
  "Meetings",
  "Documents",
  "Messages",
  "Notifications",
  "Success Stories",
  "Blog",
  "Universities",
  "Reports",
  "Email System",
  "Settings",
  "Counselors Management",
  "System Administration"
];

export async function GET(request: Request) {
  try {
    // 1. Verify Admin/Counselor Session
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (!action) {
      return NextResponse.json({ error: "Missing action parameter" }, { status: 400 });
    }

    // A. Action: Get Current User Permissions
    if (action === "get-current-user-perms") {
      if (authResult.userType === "super-admin") {
        // Super Admin gets all permissions
        return NextResponse.json({
          success: true,
          userType: "super-admin",
          roleName: "Super Admin",
          permissions: ALL_PERMISSIONS
        });
      }

      if (authResult.userType === "counselor" && authResult.counselorId) {
        // Resolve permissions for logged in counselor
        const counselorId = authResult.counselorId;

        // Fetch resolved permissions
        const resolved: string[] = [];
        for (const key of ALL_PERMISSIONS) {
          const { data } = await db.rpc("has_counselor_permission", {
            c_id: counselorId,
            perm_key: key
          });
          if (data) {
            resolved.push(key);
          }
        }

        return NextResponse.json({
          success: true,
          userType: "counselor",
          counselorId,
          roleName: authResult.roleName,
          permissions: resolved
        });
      }

      return NextResponse.json({ error: "Invalid session type" }, { status: 400 });
    }

    // Require Super Admin/System Admin privileges for CRUD operations
    const isSystemAdmin = 
      authResult.userType === "super-admin" || 
      (authResult.userType === "counselor" && 
       await db.rpc("has_counselor_permission", { c_id: authResult.counselorId, perm_key: "System Administration" }).then(res => !!res.data));

    if (!isSystemAdmin) {
      return NextResponse.json({ error: "Forbidden - Requires system administrative privileges" }, { status: 403 });
    }

    // B. Action: List Roles & default permissions
    if (action === "list-roles") {
      const { data: roles, error: rolesErr } = await db.from("user_roles").select("*").order("name");
      if (rolesErr) throw rolesErr;

      const { data: perms, error: permsErr } = await db.from("role_permissions").select("*");
      if (permsErr) throw permsErr;

      const { data: counts, error: countsErr } = await db.from("counselors").select("role_id");
      if (countsErr) throw countsErr;

      const result = roles.map(role => {
        const rolePerms = perms.filter(p => p.role_id === role.id).map(p => p.permission_key);
        const userCount = counts.filter(c => c.role_id === role.id).length;
        return {
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: rolePerms,
          userCount
        };
      });

      return NextResponse.json({ success: true, roles: result, allPermissions: ALL_PERMISSIONS });
    }

    // C. Action: Get Counselor Permissions Detail
    if (action === "get-counselor-perms") {
      const counselorId = searchParams.get("counselorId");
      if (!counselorId) {
        return NextResponse.json({ error: "Missing counselorId parameter" }, { status: 400 });
      }

      const { data: counselor, error: cErr } = await db
        .from("counselors")
        .select("id, full_name, role_id, auth_user_id")
        .eq("id", counselorId)
        .maybeSingle();

      if (cErr || !counselor) {
        return NextResponse.json({ error: "Counselor not found" }, { status: 404 });
      }

      // Default role permissions
      let defaultPerms: string[] = [];
      if (counselor.role_id) {
        const { data: rp } = await db.from("role_permissions").select("permission_key").eq("role_id", counselor.role_id);
        defaultPerms = rp?.map(r => r.permission_key) || [];
      }

      // Specific overrides
      const { data: overrides, error: oErr } = await db
        .from("counselor_permissions")
        .select("permission_key, is_enabled")
        .eq("counselor_id", counselorId);

      if (oErr) throw oErr;

      // Build permissions matrix mapping
      const matrix = ALL_PERMISSIONS.reduce((acc: any, key) => {
        const isDefaultEnabled = defaultPerms.includes(key);
        const override = overrides?.find(o => o.permission_key === key);
        
        acc[key] = {
          inherited: isDefaultEnabled,
          override: override ? override.is_enabled : null,
          effective: override ? override.is_enabled : isDefaultEnabled
        };
        return acc;
      }, {});

      return NextResponse.json({
        success: true,
        counselorId,
        roleId: counselor.role_id,
        isProvisioned: !!counselor.auth_user_id,
        permissionsMatrix: matrix
      });
    }

    return NextResponse.json({ error: `Unknown GET action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("[API GET RBAC Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify Admin Session
    const authResult = await verifyAdminSession(request);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: authResult.status || 401 });
    }

    // Require Super Admin or System Admin for configuration writes
    const isSystemAdmin = 
      authResult.userType === "super-admin" || 
      (authResult.userType === "counselor" && 
       await db.rpc("has_counselor_permission", { c_id: authResult.counselorId, perm_key: "System Administration" }).then(res => !!res.data));

    if (!isSystemAdmin) {
      return NextResponse.json({ error: "Forbidden - Requires system administrative privileges" }, { status: 403 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is required to edit permissions or provision logins." }, { status: 500 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action in request body" }, { status: 400 });
    }

    // A. Action: Create Role
    if (action === "create-role") {
      const { name, description, permissions } = body;
      if (!name) {
        return NextResponse.json({ error: "Missing role name" }, { status: 400 });
      }

      // Insert role
      const { data: newRole, error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .insert([{ name, description }])
        .select()
        .single();

      if (roleErr) throw roleErr;

      // Insert default permissions
      if (Array.isArray(permissions) && permissions.length > 0) {
        const permRecords = permissions.map(p => ({
          role_id: newRole.id,
          permission_key: p
        }));
        const { error: permErr } = await supabaseAdmin.from("role_permissions").insert(permRecords);
        if (permErr) throw permErr;
      }

      return NextResponse.json({ success: true, message: `Role "${name}" created successfully`, roleId: newRole.id });
    }

    // B. Action: Edit Role
    if (action === "edit-role") {
      const { roleId, name, description, permissions } = body;
      if (!roleId) {
        return NextResponse.json({ error: "Missing roleId parameter" }, { status: 400 });
      }

      // Update role properties
      const { error: updateErr } = await supabaseAdmin
        .from("user_roles")
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq("id", roleId);
      if (updateErr) throw updateErr;

      // Refresh default permissions
      const { error: deleteErr } = await supabaseAdmin.from("role_permissions").delete().eq("role_id", roleId);
      if (deleteErr) throw deleteErr;

      if (Array.isArray(permissions) && permissions.length > 0) {
        const permRecords = permissions.map(p => ({
          role_id: roleId,
          permission_key: p
        }));
        const { error: permErr } = await supabaseAdmin.from("role_permissions").insert(permRecords);
        if (permErr) throw permErr;
      }

      return NextResponse.json({ success: true, message: "Role permissions updated successfully" });
    }

    // C. Action: Clone Role
    if (action === "clone-role") {
      const { sourceRoleId, name, description } = body;
      if (!sourceRoleId || !name) {
        return NextResponse.json({ error: "Missing sourceRoleId or clone name" }, { status: 400 });
      }

      // Create new clone role
      const { data: newRole, error: roleErr } = await supabaseAdmin
        .from("user_roles")
        .insert([{ name, description }])
        .select()
        .single();
      if (roleErr) throw roleErr;

      // Copy default permissions
      const { data: sourcePerms, error: fetchErr } = await supabaseAdmin
        .from("role_permissions")
        .select("permission_key")
        .eq("role_id", sourceRoleId);
      if (fetchErr) throw fetchErr;

      if (sourcePerms && sourcePerms.length > 0) {
        const permRecords = sourcePerms.map(p => ({
          role_id: newRole.id,
          permission_key: p.permission_key
        }));
        const { error: permErr } = await supabaseAdmin.from("role_permissions").insert(permRecords);
        if (permErr) throw permErr;
      }

      return NextResponse.json({ success: true, message: `Cloned role successfully into "${name}"` });
    }

    // D. Action: Save Counselor Permissions (Role assignment & overrides)
    if (action === "save-counselor-perms") {
      const { counselorId, roleId, overrides } = body;
      if (!counselorId) {
        return NextResponse.json({ error: "Missing counselorId" }, { status: 400 });
      }

      // Update role_id in counselors
      const { error: updateErr } = await supabaseAdmin
        .from("counselors")
        .update({ role_id: roleId || null })
        .eq("id", counselorId);
      if (updateErr) throw updateErr;

      // Reset overrides
      const { error: resetErr } = await supabaseAdmin.from("counselor_permissions").delete().eq("counselor_id", counselorId);
      if (resetErr) throw resetErr;

      // Insert new overrides
      if (overrides && typeof overrides === "object") {
        const overrideRecords = Object.entries(overrides)
          .filter(([_, value]) => value !== null) // Filter out keys without override
          .map(([key, value]) => ({
            counselor_id: counselorId,
            permission_key: key,
            is_enabled: !!value
          }));

        if (overrideRecords.length > 0) {
          const { error: insertErr } = await supabaseAdmin.from("counselor_permissions").insert(overrideRecords);
          if (insertErr) throw insertErr;
        }
      }

      return NextResponse.json({ success: true, message: "Counselor permissions saved successfully" });
    }

    // E. Action: Provision Login (Create Supabase Auth user & Link)
    if (action === "provision-login") {
      const { counselorId, email, password } = body;
      if (!counselorId || !email || !password) {
        return NextResponse.json({ error: "Missing counselorId, email, or password" }, { status: 400 });
      }

      const { data: counselor, error: fetchErr } = await supabaseAdmin
        .from("counselors")
        .select("id, full_name, auth_user_id")
        .eq("id", counselorId)
        .maybeSingle();

      if (fetchErr || !counselor) {
        return NextResponse.json({ error: "Counselor not found" }, { status: 404 });
      }

      if (counselor.auth_user_id) {
        return NextResponse.json({ error: "Counselor already has a login account provisioned" }, { status: 400 });
      }

      // Create new Supabase Auth User with auto confirm
      const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authErr || !authUser?.user) {
        throw new Error(authErr?.message || "Failed to create Supabase Auth credentials");
      }

      // Link account
      const { error: linkErr } = await supabaseAdmin
        .from("counselors")
        .update({ auth_user_id: authUser.user.id })
        .eq("id", counselorId);

      if (linkErr) {
        // Cleanup orphaned auth user on database link failure
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
        throw linkErr;
      }

      return NextResponse.json({ 
        success: true, 
        message: `Successfully provisioned login access for "${counselor.full_name}"` 
      });
    }

    return NextResponse.json({ error: `Unknown POST action: ${action}` }, { status: 400 });
  } catch (err: any) {
    console.error("[API POST RBAC Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
