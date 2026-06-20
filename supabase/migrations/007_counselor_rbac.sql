-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Role Permissions Table (Defines default permissions for a role)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE NOT NULL,
    permission_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uniq_role_perm UNIQUE (role_id, permission_key)
);

-- 3. Create Counselor Permissions Table (Defines counselor-specific overrides)
CREATE TABLE IF NOT EXISTS public.counselor_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    counselor_id UUID REFERENCES public.counselors(id) ON DELETE CASCADE NOT NULL,
    permission_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uniq_counselor_perm UNIQUE (counselor_id, permission_key)
);

-- 4. Alter Counselors Table to link to Roles and Supabase Auth
ALTER TABLE public.counselors ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL;
ALTER TABLE public.counselors ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_counselor_auth_user ON public.counselors(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- 5. Seed Default Roles and Default Permissions
INSERT INTO public.user_roles (name, description) VALUES
('Super Admin', 'Full control over the entire system, database, and settings.'),
('Admin', 'Manage students, documents, meetings, and counselors.'),
('Senior Counselor', 'Manage assigned students, documents, and messaging.'),
('Counselor', 'Manage students and schedule consultation meetings.'),
('Placement Counselor', 'Manage career training, placement services, and career candidates.'),
('Read Only Staff', 'View student applications and documents without modification privileges.')
ON CONFLICT (name) DO NOTHING;

-- Populate default permissions for roles
DO $$
DECLARE
    r_super_id UUID;
    r_admin_id UUID;
    r_senior_id UUID;
    r_counselor_id UUID;
    r_placement_id UUID;
    r_readonly_id UUID;
BEGIN
    SELECT id INTO r_super_id FROM public.user_roles WHERE name = 'Super Admin';
    SELECT id INTO r_admin_id FROM public.user_roles WHERE name = 'Admin';
    SELECT id INTO r_senior_id FROM public.user_roles WHERE name = 'Senior Counselor';
    SELECT id INTO r_counselor_id FROM public.user_roles WHERE name = 'Counselor';
    SELECT id INTO r_placement_id FROM public.user_roles WHERE name = 'Placement Counselor';
    SELECT id INTO r_readonly_id FROM public.user_roles WHERE name = 'Read Only Staff';

    -- Super Admin gets everything (handled via code bypass or insert all keys)
    -- Admin gets standard tabs
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES
    (r_admin_id, 'Dashboard'), (r_admin_id, 'Students'), (r_admin_id, 'Career Portal Students'),
    (r_admin_id, 'Training & Placement'), (r_admin_id, 'Meetings'), (r_admin_id, 'Documents'),
    (r_admin_id, 'Messages'), (r_admin_id, 'Notifications'), (r_admin_id, 'Success Stories'),
    (r_admin_id, 'Blog'), (r_admin_id, 'Universities'), (r_admin_id, 'Counselors Management')
    ON CONFLICT DO NOTHING;

    -- Senior Counselor
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES
    (r_senior_id, 'Dashboard'), (r_senior_id, 'Students'), (r_senior_id, 'Meetings'),
    (r_senior_id, 'Documents'), (r_senior_id, 'Messages')
    ON CONFLICT DO NOTHING;

    -- Counselor
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES
    (r_counselor_id, 'Dashboard'), (r_counselor_id, 'Students'), (r_counselor_id, 'Meetings'),
    (r_counselor_id, 'Messages')
    ON CONFLICT DO NOTHING;

    -- Placement Counselor
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES
    (r_placement_id, 'Dashboard'), (r_placement_id, 'Career Portal Students'), 
    (r_placement_id, 'Training & Placement'), (r_placement_id, 'Messages')
    ON CONFLICT DO NOTHING;

    -- Read Only Staff gets view permissions
    INSERT INTO public.role_permissions (role_id, permission_key) VALUES
    (r_readonly_id, 'Dashboard'), (r_readonly_id, 'Students'), (r_readonly_id, 'Universities')
    ON CONFLICT DO NOTHING;
END $$;

-- 6. SQL Helper function to resolve runtime permissions (checking role defaults + direct overrides)
CREATE OR REPLACE FUNCTION public.has_counselor_permission(c_id UUID, perm_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    role_enabled BOOLEAN;
    override_enabled BOOLEAN;
BEGIN
    -- 1. Check if permission exists in role default permissions
    SELECT EXISTS (
        SELECT 1 FROM public.role_permissions rp
        JOIN public.counselors c ON c.role_id = rp.role_id
        WHERE c.id = c_id AND rp.permission_key = perm_key
    ) INTO role_enabled;

    -- 2. Check override permissions table
    SELECT is_enabled FROM public.counselor_permissions cp
    WHERE cp.counselor_id = c_id AND cp.permission_key = perm_key
    INTO override_enabled;

    -- 3. Return resolved result (override overrides role settings)
    IF override_enabled IS NOT NULL THEN
        RETURN override_enabled;
    ELSE
        RETURN COALESCE(role_enabled, false);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable RLS and setup select policy on new RBAC tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow select on user_roles" ON public.user_roles;
CREATE POLICY "Allow select on user_roles" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow select on role_permissions" ON public.role_permissions;
CREATE POLICY "Allow select on role_permissions" ON public.role_permissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow select on counselor_permissions" ON public.counselor_permissions;
CREATE POLICY "Allow select on counselor_permissions" ON public.counselor_permissions FOR SELECT USING (true);

-- 8. Additional policies for system administration by counselors
-- Allow active counselors to manage system settings
DROP POLICY IF EXISTS "Allow write for active counselors" ON public.system_settings;
CREATE POLICY "Allow write for active counselors" ON public.system_settings 
    FOR ALL TO authenticated 
    USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true))
    WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

-- Allow active counselors to manage notification preferences
DROP POLICY IF EXISTS "Allow write for active counselors" ON public.notification_preferences;
CREATE POLICY "Allow write for active counselors" ON public.notification_preferences 
    FOR ALL TO authenticated 
    USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true))
    WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

-- Allow active counselors to manage notification history
DROP POLICY IF EXISTS "Allow write for active counselors" ON public.notification_history;
CREATE POLICY "Allow write for active counselors" ON public.notification_history 
    FOR ALL TO authenticated 
    USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true))
    WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));
