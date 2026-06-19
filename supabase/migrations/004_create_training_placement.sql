-- Migration: Create Training & Placement System Tables
-- Purpose: Add services, purchases, tasks, documents, chat and meetings references for Training & Placement clients.

-- 1. Create training_services table
CREATE TABLE IF NOT EXISTS public.training_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies matching schema pattern
ALTER TABLE public.training_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_services" ON public.training_services;
DROP POLICY IF EXISTS "Allow public write training_services" ON public.training_services;
CREATE POLICY "Allow public select training_services" ON public.training_services FOR SELECT USING (true);
CREATE POLICY "Allow public write training_services" ON public.training_services FOR ALL USING (true) WITH CHECK (true);

-- 2. Create training_students table (Purchased/lead clients)
CREATE TABLE IF NOT EXISTS public.training_students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES public.training_services(id) ON DELETE RESTRICT,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_phone TEXT,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    assigned_consultant_id UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Active', 'Completed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    auth_user_id UUID UNIQUE
);

-- Enable RLS and define open policies
ALTER TABLE public.training_students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_students" ON public.training_students;
DROP POLICY IF EXISTS "Allow public write training_students" ON public.training_students;
CREATE POLICY "Allow public select training_students" ON public.training_students FOR SELECT USING (true);
CREATE POLICY "Allow public write training_students" ON public.training_students FOR ALL USING (true) WITH CHECK (true);

-- 3. Create training_tasks table (Careers tasks assigned to students)
CREATE TABLE IF NOT EXISTS public.training_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed', 'Under Review'
    due_date TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    file_url TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies
ALTER TABLE public.training_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_tasks" ON public.training_tasks;
DROP POLICY IF EXISTS "Allow public write training_tasks" ON public.training_tasks;
CREATE POLICY "Allow public select training_tasks" ON public.training_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public write training_tasks" ON public.training_tasks FOR ALL USING (true) WITH CHECK (true);

-- 4. Create training_documents table
CREATE TABLE IF NOT EXISTS public.training_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by TEXT NOT NULL, -- 'student' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies
ALTER TABLE public.training_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_documents" ON public.training_documents;
DROP POLICY IF EXISTS "Allow public write training_documents" ON public.training_documents;
CREATE POLICY "Allow public select training_documents" ON public.training_documents FOR SELECT USING (true);
CREATE POLICY "Allow public write training_documents" ON public.training_documents FOR ALL USING (true) WITH CHECK (true);

-- 5. Extend public.meetings table with training_student_id reference
ALTER TABLE public.meetings ADD COLUMN IF NOT EXISTS training_student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_meetings_training_student_id ON public.meetings(training_student_id);

-- 6. Create training_messages table (Realtime chat messaging)
CREATE TABLE IF NOT EXISTS public.training_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'student', 'admin', 'counselor'
    message TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    status TEXT DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies
ALTER TABLE public.training_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_messages" ON public.training_messages;
DROP POLICY IF EXISTS "Allow public write training_messages" ON public.training_messages;
CREATE POLICY "Allow public select training_messages" ON public.training_messages FOR SELECT USING (true);
CREATE POLICY "Allow public write training_messages" ON public.training_messages FOR ALL USING (true) WITH CHECK (true);

-- 7. Create training_conversations table
CREATE TABLE IF NOT EXISTS public.training_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE UNIQUE,
    last_message TEXT,
    last_sender_type TEXT,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unread_count_admin INTEGER DEFAULT 0,
    unread_count_student INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and define open policies
ALTER TABLE public.training_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select training_conversations" ON public.training_conversations;
DROP POLICY IF EXISTS "Allow public write training_conversations" ON public.training_conversations;
CREATE POLICY "Allow public select training_conversations" ON public.training_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public write training_conversations" ON public.training_conversations FOR ALL USING (true) WITH CHECK (true);

-- 8. Add function and trigger to handle training conversation updates on new messages
CREATE OR REPLACE FUNCTION public.handle_new_training_message()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.training_conversations (
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
            WHEN NEW.sender_type = 'student' THEN public.training_conversations.unread_count_admin + 1 
            ELSE public.training_conversations.unread_count_admin 
        END,
        unread_count_student = CASE 
            WHEN NEW.sender_type = 'counselor' THEN public.training_conversations.unread_count_student + 1 
            ELSE public.training_conversations.unread_count_student 
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_new_training_message ON public.training_messages;
CREATE TRIGGER on_new_training_message
    AFTER INSERT ON public.training_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_training_message();

-- Enable Realtime replication
ALTER TABLE public.training_messages REPLICA IDENTITY FULL;
ALTER TABLE public.training_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.training_tasks REPLICA IDENTITY FULL;
ALTER TABLE public.training_students REPLICA IDENTITY FULL;

-- Note: Ensure these are in the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_students;

-- 9. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_tasks_student_id ON public.training_tasks(student_id);
CREATE INDEX IF NOT EXISTS idx_training_documents_student_id ON public.training_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_training_messages_student_id ON public.training_messages(student_id);
CREATE INDEX IF NOT EXISTS idx_training_students_auth_user_id ON public.training_students(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_training_conversations_last_activity ON public.training_conversations(last_activity_at DESC);

-- 10. Database function to safely check auth user details from public schema
CREATE OR REPLACE FUNCTION public.check_auth_user_status(email_to_check TEXT)
RETURNS TABLE (
    user_id UUID,
    email_confirmed BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT id, (email_confirmed_at IS NOT NULL) AS email_confirmed, au.created_at
    FROM auth.users au
    WHERE au.email = email_to_check;
END;
$$ LANGUAGE plpgsql;

-- 11. Database trigger function to auto-confirm new auth user email signups immediately
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_user_email();
