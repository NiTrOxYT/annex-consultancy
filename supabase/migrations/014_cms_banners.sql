-- Migration 014: Simple CMS Banners System (Desktop & Mobile Images per Location)
CREATE TABLE IF NOT EXISTS public.cms_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  target_destination TEXT DEFAULT 'India', -- 'All', 'India', 'UK', etc.
  title TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access & admin full access
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
