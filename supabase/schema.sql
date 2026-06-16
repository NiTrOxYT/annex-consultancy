-- Annex Educational Consultancy Database Schema
-- Includes bookings, universities, and posts tables with complete Row Level Security (RLS) policies.

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
DROP POLICY IF EXISTS "Allow admin select bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public operations on bookings" ON public.bookings;

-- Policies:
-- 1. Anyone (including students via the public site) can insert bookings.
CREATE POLICY "Allow public insert on bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- 2. Anyone (including the unauthenticated admin client role 'anon') can read/write bookings.
-- This ensures the client-side admin gate has access without needing a Supabase Auth session.
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
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    website TEXT,
    tuition_range TEXT, -- e.g., "$10,000 - $20,000"
    intake_months TEXT, -- e.g., "September, January, May"
    application_deadline TEXT, -- e.g., "June 30"
    status TEXT DEFAULT 'Active', -- "Active", "Hidden"
    featured BOOLEAN DEFAULT false,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read on universities" ON public.universities;
DROP POLICY IF EXISTS "Allow admin operations on universities" ON public.universities;
DROP POLICY IF EXISTS "Allow public select universities" ON public.universities;
DROP POLICY IF EXISTS "Allow public write universities" ON public.universities;

-- Policies:
-- 1. Anyone can view universities.
CREATE POLICY "Allow public select universities" ON public.universities
    FOR SELECT USING (true);

-- 2. Anyone (including the admin portal client) can insert/update/delete universities.
CREATE POLICY "Allow public write universities" ON public.universities
    FOR ALL USING (true) WITH CHECK (true);


----------------------------------------------------
-- 3. CMS Blog & Success Story Posts Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT, -- URL of cover image
    category TEXT NOT NULL, -- "Blog", "Success Story"
    tags TEXT, -- Comma-separated strings, e.g. "Visa, Australia, IELTS"
    author TEXT DEFAULT 'Annex Team',
    published BOOLEAN DEFAULT false,
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read on published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow admin operations on posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public select posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public write posts" ON public.posts;

-- Policies:
-- 1. Anyone can read posts.
CREATE POLICY "Allow public select posts" ON public.posts
    FOR SELECT USING (true);

-- 2. Anyone (including the admin portal client) can insert/update/delete posts.
CREATE POLICY "Allow public write posts" ON public.posts
    FOR ALL USING (true) WITH CHECK (true);
