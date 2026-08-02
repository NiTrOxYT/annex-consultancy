-- Migration 016: Add display_location to cms_banners
ALTER TABLE public.cms_banners
  ADD COLUMN IF NOT EXISTS display_location TEXT DEFAULT 'homepage';

-- Add index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_cms_banners_display_location ON public.cms_banners(display_location);

-- Backfill existing rows: homepage is the safe default
UPDATE public.cms_banners
  SET display_location = 'homepage'
  WHERE display_location IS NULL;
