-- Migration: Create Career Experts Table
-- Purpose: Store administrative-managed career consultancy experts listed on the Training & Placement landing page.

CREATE TABLE IF NOT EXISTS public.career_experts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    expertise TEXT NOT NULL,
    photo_url TEXT,
    linkedin_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies matching schema pattern
ALTER TABLE public.career_experts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select career_experts" ON public.career_experts;
DROP POLICY IF EXISTS "Allow public write career_experts" ON public.career_experts;
CREATE POLICY "Allow public select career_experts" ON public.career_experts FOR SELECT USING (true);
CREATE POLICY "Allow public write career_experts" ON public.career_experts FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime replication
ALTER TABLE public.career_experts REPLICA IDENTITY FULL;

-- Note: Ensure it is registered in publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.career_experts;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_experts_is_active_order ON public.career_experts(is_active, display_order);
