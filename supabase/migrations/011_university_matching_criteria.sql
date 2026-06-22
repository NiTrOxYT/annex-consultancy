-- Migration 011: Add university matching criteria columns and indexes
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS min_percentage NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_ielts NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_pte INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_toefl INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS degree_level TEXT DEFAULT 'Bachelors',
ADD COLUMN IF NOT EXISTS annual_fees NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS scholarship_available BOOLEAN DEFAULT false;

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_universities_featured ON public.universities(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_universities_min_percentage ON public.universities(min_percentage);
CREATE INDEX IF NOT EXISTS idx_universities_annual_fees ON public.universities(annual_fees);
CREATE INDEX IF NOT EXISTS idx_universities_country ON public.universities(country);
CREATE INDEX IF NOT EXISTS idx_universities_published ON public.universities(published);
