-- Create tables for Annex Educational Consultancy Database Schema

-- 1. Consultation Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    study_level TEXT NOT NULL, -- "Undergraduate", "Postgraduate", "Language", etc.
    destination TEXT NOT NULL, -- "UK", "Australia", "Europe", "Dubai", "Italy", "India"
    subject_interest TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending', -- "Pending", "Confirmed", "Cancelled", "Completed"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (students booking from public website)
CREATE POLICY "Allow public insert on bookings" ON public.bookings
    FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to view/modify bookings
CREATE POLICY "Allow admin select bookings" ON public.bookings
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update bookings" ON public.bookings
    FOR UPDATE TO authenticated USING (true);


-- 2. Lead Intake (Inquiries from generic forms)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    study_destination TEXT NOT NULL,
    preferred_course TEXT,
    message TEXT,
    source TEXT DEFAULT 'Web Form', -- "Contact Page", "Home Hero", etc.
    status TEXT DEFAULT 'New', -- "New", "Contacted", "Qualified", "Lost"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin select leads" ON public.leads
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admin update leads" ON public.leads
    FOR UPDATE TO authenticated USING (true);


-- 3. University Database
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL, -- "UK", "Australia", "Italy", etc.
    city TEXT NOT NULL,
    global_rank INTEGER,
    popular_courses TEXT[] DEFAULT '{}',
    intakes TEXT[] DEFAULT '{}', -- e.g., ["September", "January"]
    scholarships_available BOOLEAN DEFAULT false,
    requirements TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- Public can view universities
CREATE POLICY "Allow public read on universities" ON public.universities
    FOR SELECT USING (true);

-- Admins can write
CREATE POLICY "Allow admin operations on universities" ON public.universities
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 4. Blog & Success Story CMS
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT NOT NULL, -- "Blog", "Success Story"
    student_name TEXT, -- only for success stories
    university_placed TEXT, -- only for success stories
    visa_year INTEGER, -- only for success stories
    published BOOLEAN DEFAULT false,
    author TEXT DEFAULT 'Annex Team',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on published posts" ON public.posts
    FOR SELECT USING (published = true);

CREATE POLICY "Allow admin operations on posts" ON public.posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
