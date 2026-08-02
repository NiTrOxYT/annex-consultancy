-- Migration 017: Add target_device column to cms_banners table
-- Enables separate banner records for desktop vs mobile

ALTER TABLE public.cms_banners
  ADD COLUMN IF NOT EXISTS target_device TEXT DEFAULT 'desktop';

-- Backfill existing records to 'desktop'
UPDATE public.cms_banners
  SET target_device = 'desktop'
  WHERE target_device IS NULL;

-- Composite index for fast location + device + active filtering
CREATE INDEX IF NOT EXISTS idx_cms_banners_location_device_active 
  ON public.cms_banners (display_location, target_device, is_active);
