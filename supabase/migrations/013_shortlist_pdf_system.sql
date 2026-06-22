-- Migration 013: Create shortlist_requests table for Counselor-Reviewed Shortlist System

CREATE TABLE IF NOT EXISTS public.shortlist_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.eligibility_leads(id) ON DELETE CASCADE NOT NULL,
    counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Requested', 'In Review', 'Generated', 'Delivered')) DEFAULT 'Requested',
    pdf_url TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.shortlist_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (anonymous visitor requests)
DROP POLICY IF EXISTS "Allow public insert on shortlist_requests" ON public.shortlist_requests;
CREATE POLICY "Allow public insert on shortlist_requests" 
    ON public.shortlist_requests
    FOR INSERT WITH CHECK (true);

-- Allow public selection (for tracking/downloading by anonymous visitors)
DROP POLICY IF EXISTS "Allow public select on shortlist_requests" ON public.shortlist_requests;
CREATE POLICY "Allow public select on shortlist_requests" 
    ON public.shortlist_requests
    FOR SELECT USING (true);

-- Allow public updates (for tracking download counts anonymously)
DROP POLICY IF EXISTS "Allow public update on shortlist_requests" ON public.shortlist_requests;
CREATE POLICY "Allow public update on shortlist_requests" 
    ON public.shortlist_requests
    FOR UPDATE USING (true) WITH CHECK (true);

-- Allow authenticated counselors all permissions
DROP POLICY IF EXISTS "Counselors can manage shortlist_requests" ON public.shortlist_requests;
CREATE POLICY "Counselors can manage shortlist_requests" 
    ON public.shortlist_requests
    FOR ALL USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    ) WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_shortlist_requests_lead ON public.shortlist_requests(lead_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_requests_counselor ON public.shortlist_requests(counselor_id);
CREATE INDEX IF NOT EXISTS idx_shortlist_requests_status ON public.shortlist_requests(status);
CREATE INDEX IF NOT EXISTS idx_shortlist_requests_requested ON public.shortlist_requests(requested_at);

-- Enable realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.shortlist_requests;
