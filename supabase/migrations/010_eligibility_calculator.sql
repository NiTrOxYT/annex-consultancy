-- 1. Add lead_source column to public.bookings and public.students if not exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'Direct';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'Direct';

-- 2. Create eligibility_leads table
CREATE TABLE IF NOT EXISTS public.eligibility_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    qualification TEXT NOT NULL,
    percentage NUMERIC NOT NULL,
    budget NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    preferred_country TEXT NOT NULL,
    preferred_course TEXT NOT NULL,
    test_type TEXT,
    test_score NUMERIC,
    intake TEXT NOT NULL,
    lead_score TEXT CHECK (lead_score IN ('Hot', 'Warm', 'Cold')),
    lead_score_value INTEGER NOT NULL,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referrer TEXT,
    referral_code TEXT REFERENCES public.students(referral_code) ON DELETE SET NULL,
    assigned_counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    lead_status TEXT DEFAULT 'New' CHECK (lead_status IN ('New', 'Contacted', 'Qualified', 'Unqualified', 'Converted')),
    first_contacted_at TIMESTAMP WITH TIME ZONE,
    response_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on eligibility_leads
ALTER TABLE public.eligibility_leads ENABLE ROW LEVEL SECURITY;

-- 3. Create eligibility_matches table
CREATE TABLE IF NOT EXISTS public.eligibility_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE NOT NULL,
    university_name_snapshot TEXT NOT NULL,
    match_score INTEGER NOT NULL,
    admission_chance TEXT CHECK (admission_chance IN ('Safe', 'Target', 'Ambitious')) NOT NULL,
    scholarship_estimate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on eligibility_matches
ALTER TABLE public.eligibility_matches ENABLE ROW LEVEL SECURITY;

-- 4. Create eligibility_assignments table
CREATE TABLE IF NOT EXISTS public.eligibility_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    old_counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    new_counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    assigned_by UUID REFERENCES public.counselors(id) ON DELETE SET NULL
);

-- Enable RLS on eligibility_assignments
ALTER TABLE public.eligibility_assignments ENABLE ROW LEVEL SECURITY;

-- 5. Create eligibility_reminders table
CREATE TABLE IF NOT EXISTS public.eligibility_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    completion_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on eligibility_reminders
ALTER TABLE public.eligibility_reminders ENABLE ROW LEVEL SECURITY;

-- 6. Create eligibility_activities table
CREATE TABLE IF NOT EXISTS public.eligibility_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL, -- e.g., 'Lead Created', 'Counselor Assigned', 'Status Changed', 'Converted'
    description TEXT NOT NULL,
    created_by UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on eligibility_activities
ALTER TABLE public.eligibility_activities ENABLE ROW LEVEL SECURITY;

-- 7. Create eligibility_notes table
CREATE TABLE IF NOT EXISTS public.eligibility_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on eligibility_notes
ALTER TABLE public.eligibility_notes ENABLE ROW LEVEL SECURITY;

-- 8. Row Level Security Policies

-- RLS for eligibility_leads
DROP POLICY IF EXISTS "Allow public insert on eligibility_leads" ON public.eligibility_leads;
CREATE POLICY "Allow public insert on eligibility_leads" ON public.eligibility_leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Counselors can view all eligibility_leads" ON public.eligibility_leads;
CREATE POLICY "Counselors can view all eligibility_leads" ON public.eligibility_leads
    FOR SELECT USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

DROP POLICY IF EXISTS "Counselors can manage all eligibility_leads" ON public.eligibility_leads;
CREATE POLICY "Counselors can manage all eligibility_leads" ON public.eligibility_leads
    FOR ALL USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    ) WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- RLS for eligibility_matches
DROP POLICY IF EXISTS "Allow public insert on eligibility_matches" ON public.eligibility_matches;
CREATE POLICY "Allow public insert on eligibility_matches" ON public.eligibility_matches
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Counselors can view eligibility_matches" ON public.eligibility_matches;
CREATE POLICY "Counselors can view eligibility_matches" ON public.eligibility_matches
    FOR SELECT USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

DROP POLICY IF EXISTS "Counselors can manage eligibility_matches" ON public.eligibility_matches;
CREATE POLICY "Counselors can manage eligibility_matches" ON public.eligibility_matches
    FOR ALL USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    ) WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- RLS for other tables (Counselors only view/manage)
CREATE POLICY "Counselors can view assignments" ON public.eligibility_assignments FOR SELECT USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));
CREATE POLICY "Counselors can manage assignments" ON public.eligibility_assignments FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

CREATE POLICY "Counselors can view reminders" ON public.eligibility_reminders FOR SELECT USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));
CREATE POLICY "Counselors can manage reminders" ON public.eligibility_reminders FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

CREATE POLICY "Counselors can view activities" ON public.eligibility_activities FOR SELECT USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));
CREATE POLICY "Counselors can manage activities" ON public.eligibility_activities FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

CREATE POLICY "Counselors can view notes" ON public.eligibility_notes FOR SELECT USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));
CREATE POLICY "Counselors can manage notes" ON public.eligibility_notes FOR ALL USING (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)) WITH CHECK (auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true));

-- 9. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_email ON public.eligibility_leads(email);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_phone ON public.eligibility_leads(phone);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_counselor ON public.eligibility_leads(assigned_counselor_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_score ON public.eligibility_leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_priority ON public.eligibility_leads(priority);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_status ON public.eligibility_leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_eligibility_leads_created ON public.eligibility_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_eligibility_matches_lead ON public.eligibility_matches(lead_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_reminders_lead ON public.eligibility_reminders(lead_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_assignments_lead ON public.eligibility_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_activities_lead ON public.eligibility_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_notes_lead ON public.eligibility_notes(lead_id);

-- 10. Enable realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.eligibility_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.eligibility_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.eligibility_reminders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.eligibility_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.eligibility_notes;
