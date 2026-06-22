-- Migration 012: Create eligibility_preview_logs table for conversion tracking
CREATE TABLE IF NOT EXISTS public.eligibility_preview_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('preview_viewed', 'results_unlocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.eligibility_preview_logs ENABLE ROW LEVEL SECURITY;

-- Allow public insertion (anonymous visitor tracking)
DROP POLICY IF EXISTS "Allow public insert on eligibility_preview_logs" ON public.eligibility_preview_logs;
CREATE POLICY "Allow public insert on eligibility_preview_logs" 
    ON public.eligibility_preview_logs
    FOR INSERT WITH CHECK (true);

-- Allow authenticated active counselors to select for analytics calculation
DROP POLICY IF EXISTS "Counselors can view eligibility_preview_logs" ON public.eligibility_preview_logs;
CREATE POLICY "Counselors can view eligibility_preview_logs" 
    ON public.eligibility_preview_logs
    FOR SELECT USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_eligibility_preview_logs_session ON public.eligibility_preview_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_preview_logs_event ON public.eligibility_preview_logs(event_type);
