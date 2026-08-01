-- Migration 014: CMS Banners System for Student Dashboard & Portal
CREATE TABLE IF NOT EXISTS public.cms_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT DEFAULT '/study-in-india',
  button_text TEXT DEFAULT 'Explore Programs',
  target_destination TEXT DEFAULT 'India', -- 'All', 'India', 'UK', etc.
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cms_banners' AND policyname = 'Allow public read access to cms_banners'
  ) THEN
    CREATE POLICY "Allow public read access to cms_banners" ON public.cms_banners FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cms_banners' AND policyname = 'Allow full access to cms_banners'
  ) THEN
    CREATE POLICY "Allow full access to cms_banners" ON public.cms_banners FOR ALL USING (true);
  END IF;
END $$;
