-- Migration: Create meetings table for counselor-managed meetings
-- Supports: Scheduled, Completed, Cancelled, Rescheduled statuses

CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    meeting_type TEXT NOT NULL DEFAULT 'Google Meet', -- 'Google Meet', 'Zoom', 'Microsoft Teams', 'Phone Call', 'Office Visit'
    meeting_link TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'Completed', 'Cancelled', 'Rescheduled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select meetings" ON public.meetings;
DROP POLICY IF EXISTS "Allow public write meetings" ON public.meetings;

CREATE POLICY "Allow public select meetings" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Allow public write meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_meetings_student_id ON public.meetings(student_id);
CREATE INDEX IF NOT EXISTS idx_meetings_counselor_id ON public.meetings(counselor_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON public.meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);

-- Enable Realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
