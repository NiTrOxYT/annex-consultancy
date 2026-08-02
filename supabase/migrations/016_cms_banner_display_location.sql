-- Migration 016: Add display_location to cms_banners table
-- Supports: homepage, student_dashboard, referral_page, public_referral, consultation, university_listing, blog, country_page, success_stories, global

ALTER TABLE public.cms_banners
  ADD COLUMN IF NOT EXISTS display_location TEXT DEFAULT 'homepage';

-- Backfill any existing records to default 'homepage'
UPDATE public.cms_banners
  SET display_location = 'homepage'
  WHERE display_location IS NULL;

-- Composite index for fast location + active filtering
CREATE INDEX IF NOT EXISTS idx_cms_banners_location_active 
  ON public.cms_banners (display_location, is_active);

-- Drop obsolete single column index if exists
DROP INDEX IF EXISTS public.idx_cms_banners_display_location;
