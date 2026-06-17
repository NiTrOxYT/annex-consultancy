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


----------------------------------------------------
-- 5. Student Portal Tables
----------------------------------------------------

-- A. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    destination TEXT, -- Country destination
    intake TEXT, -- e.g., "September 2026"
    status TEXT DEFAULT 'Active', -- "Active", "Disabled"
    counselor TEXT DEFAULT 'Annex Counselor',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    academic_details TEXT, -- e.g. Qualifications, GPA, IELTS score
    preferred_course TEXT,
    emergency_contact TEXT,
    passport_details TEXT,
    current_stage TEXT DEFAULT 'Consultation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    auth_user_id UUID UNIQUE -- Links to auth.users.id; used for login lookups
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select students" ON public.students;
DROP POLICY IF EXISTS "Allow public write students" ON public.students;

CREATE POLICY "Allow public select students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public write students" ON public.students FOR ALL USING (true) WITH CHECK (true);

-- B. Student Tasks Table
CREATE TABLE IF NOT EXISTS public.student_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_tasks" ON public.student_tasks;
DROP POLICY IF EXISTS "Allow public write student_tasks" ON public.student_tasks;
CREATE POLICY "Allow public select student_tasks" ON public.student_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public write student_tasks" ON public.student_tasks FOR ALL USING (true) WITH CHECK (true);

-- C. Student Documents Table
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'Passport', 'Academic Certificates', 'IELTS / PTE', 'SOP', 'LOR', 'Financial Documents', 'Visa Documents'
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT DEFAULT 'Pending Review', -- 'Pending Review', 'Approved', 'Rejected', 'Requires Correction'
    feedback TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_documents" ON public.student_documents;
DROP POLICY IF EXISTS "Allow public write student_documents" ON public.student_documents;
CREATE POLICY "Allow public select student_documents" ON public.student_documents FOR SELECT USING (true);
CREATE POLICY "Allow public write student_documents" ON public.student_documents FOR ALL USING (true) WITH CHECK (true);

-- D. Student Messages Table
CREATE TABLE IF NOT EXISTS public.student_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'student', 'admin', 'counselor'
    message TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_messages" ON public.student_messages;
DROP POLICY IF EXISTS "Allow public write student_messages" ON public.student_messages;
CREATE POLICY "Allow public select student_messages" ON public.student_messages FOR SELECT USING (true);
CREATE POLICY "Allow public write student_messages" ON public.student_messages FOR ALL USING (true) WITH CHECK (true);

-- E. Student Notifications Table
CREATE TABLE IF NOT EXISTS public.student_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_notifications" ON public.student_notifications;
DROP POLICY IF EXISTS "Allow public write student_notifications" ON public.student_notifications;
CREATE POLICY "Allow public select student_notifications" ON public.student_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write student_notifications" ON public.student_notifications FOR ALL USING (true) WITH CHECK (true);

-- F. Student Activity Logs Table
CREATE TABLE IF NOT EXISTS public.student_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_activity_logs" ON public.student_activity_logs;
DROP POLICY IF EXISTS "Allow public write student_activity_logs" ON public.student_activity_logs;
CREATE POLICY "Allow public select student_activity_logs" ON public.student_activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public write student_activity_logs" ON public.student_activity_logs FOR ALL USING (true) WITH CHECK (true);

-- G. Student Offer Letters Table
CREATE TABLE IF NOT EXISTS public.student_offer_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    letter_type TEXT NOT NULL, -- 'Conditional Offer', 'Unconditional Offer', 'CAS Letter', 'Admission Letter', 'Tuition Receipt'
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_offer_letters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_offer_letters" ON public.student_offer_letters;
DROP POLICY IF EXISTS "Allow public write student_offer_letters" ON public.student_offer_letters;
CREATE POLICY "Allow public select student_offer_letters" ON public.student_offer_letters FOR SELECT USING (true);
CREATE POLICY "Allow public write student_offer_letters" ON public.student_offer_letters FOR ALL USING (true) WITH CHECK (true);

-- H. Student Visa Status Table
CREATE TABLE IF NOT EXISTS public.student_visa_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
    status TEXT DEFAULT 'Application Started', -- 'Application Started', 'Documents Submitted', 'Biometrics Scheduled', 'Biometrics Completed', 'Visa Decision Pending', 'Visa Approved'
    details TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.student_visa_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select student_visa_status" ON public.student_visa_status;
DROP POLICY IF EXISTS "Allow public write student_visa_status" ON public.student_visa_status;
CREATE POLICY "Allow public select student_visa_status" ON public.student_visa_status FOR SELECT USING (true);
CREATE POLICY "Allow public write student_visa_status" ON public.student_visa_status FOR ALL USING (true) WITH CHECK (true);

----------------------------------------------------
-- 6. Storage Bucket for Student Portal
----------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-files', 'student-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Allow public read on student-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public write on student-files" ON storage.objects;

CREATE POLICY "Allow public read on student-files" ON storage.objects
    FOR SELECT USING (bucket_id = 'student-files');

CREATE POLICY "Allow public write on student-files" ON storage.objects
    FOR ALL USING (bucket_id = 'student-files') WITH CHECK (bucket_id = 'student-files');

----------------------------------------------------
-- 7. Chat System Upgrades (Realtime, Unread, and Attachments)
----------------------------------------------------

-- A. Alter student_messages to add status column if it doesn't exist
ALTER TABLE public.student_messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';

-- B. Create student_conversations table
CREATE TABLE IF NOT EXISTS public.student_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
    last_message TEXT,
    last_sender_type TEXT,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unread_count_admin INTEGER DEFAULT 0,
    unread_count_student INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.student_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select student_conversations" ON public.student_conversations;
DROP POLICY IF EXISTS "Allow public write student_conversations" ON public.student_conversations;

CREATE POLICY "Allow public select student_conversations" ON public.student_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public write student_conversations" ON public.student_conversations FOR ALL USING (true) WITH CHECK (true);

-- C. Create message_attachments table
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.student_messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select message_attachments" ON public.message_attachments;
DROP POLICY IF EXISTS "Allow public write message_attachments" ON public.message_attachments;

CREATE POLICY "Allow public select message_attachments" ON public.message_attachments FOR SELECT USING (true);
CREATE POLICY "Allow public write message_attachments" ON public.message_attachments FOR ALL USING (true) WITH CHECK (true);

-- D. Create message_notifications table
CREATE TABLE IF NOT EXISTS public.message_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.student_messages(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL, -- 'email'
    recipient_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.message_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select message_notifications" ON public.message_notifications;
DROP POLICY IF EXISTS "Allow public write message_notifications" ON public.message_notifications;

CREATE POLICY "Allow public select message_notifications" ON public.message_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public write message_notifications" ON public.message_notifications FOR ALL USING (true) WITH CHECK (true);

-- E. Create function and trigger to handle student conversations updates on new messages
CREATE OR REPLACE FUNCTION public.handle_new_student_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.student_conversations (
        student_id,
        last_message,
        last_sender_type,
        last_activity_at,
        unread_count_admin,
        unread_count_student
    )
    VALUES (
        NEW.student_id,
        NEW.message,
        NEW.sender_type,
        NEW.created_at,
        CASE WHEN NEW.sender_type = 'student' THEN 1 ELSE 0 END,
        CASE WHEN NEW.sender_type = 'counselor' THEN 1 ELSE 0 END
    )
    ON CONFLICT (student_id) DO UPDATE
    SET 
        last_message = NEW.message,
        last_sender_type = NEW.sender_type,
        last_activity_at = NEW.created_at,
        unread_count_admin = CASE 
            WHEN NEW.sender_type = 'student' THEN public.student_conversations.unread_count_admin + 1 
            ELSE public.student_conversations.unread_count_admin 
        END,
        unread_count_student = CASE 
            WHEN NEW.sender_type = 'counselor' THEN public.student_conversations.unread_count_student + 1 
            ELSE public.student_conversations.unread_count_student 
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_student_message ON public.student_messages;
CREATE TRIGGER on_new_student_message
    AFTER INSERT ON public.student_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_student_message();

-- F. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_student_messages_student_id ON public.student_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_student_messages_created_at ON public.student_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_conversations_last_activity ON public.student_conversations(last_activity_at DESC);

-- G. Enable Realtime Replication
-- Note: If tables are already published in replication, these statements might throw a harmless notice/warning.
-- In Supabase, you can also toggle this via Database -> Replication.
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_conversations;

----------------------------------------------------
-- 8. Counselor Management System Tables
----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.counselors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    designation TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public select counselors" ON public.counselors;
DROP POLICY IF EXISTS "Allow public write counselors" ON public.counselors;

CREATE POLICY "Allow public select counselors" ON public.counselors FOR SELECT USING (true);
CREATE POLICY "Allow public write counselors" ON public.counselors FOR ALL USING (true) WITH CHECK (true);

-- Update students table to reference counselor_id
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS counselor_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL;

-- Enable replication for counselors
ALTER PUBLICATION supabase_realtime ADD TABLE public.counselors;
