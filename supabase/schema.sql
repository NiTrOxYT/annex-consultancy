-- Annex Educational Consultancy Database Schema
-- Includes bookings, universities, posts, and success_stories tables with complete Row Level Security (RLS) policies.

----------------------------------------------------
-- 1. Consultation Bookings Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    study_level TEXT NOT NULL, -- e.g., "Undergraduate", "Postgraduate"
    destination TEXT NOT NULL, -- e.g., "UK", "Australia", "Europe", "Dubai", "Italy", "India"
    subject_interest TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending', -- "Pending", "Confirmed", "Cancelled"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplication errors
DROP POLICY IF EXISTS "Allow public insert on bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public select bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete bookings" ON public.bookings;

-- Policies:
CREATE POLICY "Allow public insert on bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select bookings" ON public.bookings
    FOR SELECT USING (true);

CREATE POLICY "Allow public update bookings" ON public.bookings
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete bookings" ON public.bookings
    FOR DELETE USING (true);


----------------------------------------------------
-- 2. Universities Database Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    category TEXT NOT NULL,              -- e.g., 'MBA', 'Engineering', 'MBBS', 'BCA', 'BBA', 'Nursing'
    course_type TEXT DEFAULT 'Undergraduate', -- e.g., 'Undergraduate', 'Postgraduate'
    ranking INTEGER,
    ranking_source TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    total_fees TEXT,
    application_deadline TEXT,
    intake TEXT,
    cutoff TEXT,
    website_url TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    views_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public select universities" ON public.universities;
DROP POLICY IF EXISTS "Allow public write universities" ON public.universities;

-- Policies:
CREATE POLICY "Allow public select universities" ON public.universities
    FOR SELECT USING (true);

CREATE POLICY "Allow public write universities" ON public.universities
    FOR ALL USING (true) WITH CHECK (true);


----------------------------------------------------
-- 3. CMS Blog Posts Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    category TEXT NOT NULL, -- "Blog" or "Success Story" (kept for legacy support)
    tags TEXT, -- Comma-separated tags
    author TEXT DEFAULT 'Annex Team',
    published BOOLEAN DEFAULT false,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public select posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public write posts" ON public.posts;

-- Policies:
CREATE POLICY "Allow public select posts" ON public.posts
    FOR SELECT USING (true);

CREATE POLICY "Allow public write posts" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);


----------------------------------------------------
-- 4. Success Stories Database Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    destination TEXT NOT NULL, -- country name, e.g. "UK", "Australia"
    university TEXT NOT NULL,
    course TEXT NOT NULL,
    quote TEXT NOT NULL, -- testimonial quote
    year INTEGER NOT NULL, -- intake year, e.g. 2025
    student_photo_url TEXT,
    success_metrics TEXT, -- e.g. "PTE 79 Overall", "100% Tuition Waiver"
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public select success_stories" ON public.success_stories;
DROP POLICY IF EXISTS "Allow public write success_stories" ON public.success_stories;

-- Policies:
CREATE POLICY "Allow public select success_stories" ON public.success_stories
    FOR SELECT USING (true);

CREATE POLICY "Allow public write success_stories" ON public.success_stories
    FOR ALL USING (true) WITH CHECK (true);
