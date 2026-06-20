# Notification System Schema

This document details the database additions required for Version 1 of the Automated Student Notification System. These changes do NOT modify any existing tables (`students`, `student_tasks`, `meetings`, `student_visa_status`, etc.) and focus solely on separate management, preferences, logging, and settings tables.

---

## 1. SQL Schema Definition

```sql
-- 1. System Settings Table (For Global Master Switch)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default value for the global master switch
INSERT INTO public.system_settings (key, value)
VALUES ('notifications_enabled', 'true')
ON CONFLICT (key) DO NOTHING;


-- 2. Notification Preferences Table (Individual Student Toggles)
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    training_student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE,
    missing_documents_enabled BOOLEAN DEFAULT true NOT NULL,
    consultation_enabled BOOLEAN DEFAULT true NOT NULL,
    visa_updates_enabled BOOLEAN DEFAULT true NOT NULL,
    all_notifications_enabled BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_preferences_only_one_student CHECK (
        (student_id IS NOT NULL AND training_student_id IS NULL) OR
        (student_id IS NULL AND training_student_id IS NOT NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notif_pref_student ON public.notification_preferences(student_id) WHERE student_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_notif_pref_training ON public.notification_preferences(training_student_id) WHERE training_student_id IS NOT NULL;


-- 3. Notification History Table (Delivery Logs & Cooldown Checks)
CREATE TABLE IF NOT EXISTS public.notification_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    training_student_id UUID REFERENCES public.training_students(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL, -- 'missing_documents', 'consultation', 'visa_update'
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'sent' NOT NULL, -- 'sent', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_history_only_one_student CHECK (
        (student_id IS NOT NULL AND training_student_id IS NULL) OR
        (student_id IS NULL AND training_student_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_notif_hist_student ON public.notification_history(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notif_hist_training ON public.notification_history(training_student_id) WHERE training_student_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notif_hist_type_time ON public.notification_history(notification_type, sent_at DESC);
```

---

## 2. Row Level Security (RLS) Policies

To protect candidate and student preferences, we will enable RLS on the new tables. Only the matching authenticated student is allowed to read and update their preference records, while administrators have unrestricted access.

```sql
-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- 1. System Settings Policies
-- Public reads key-values (for client-side or check functions), but only admins can update
CREATE POLICY "Allow public read on system settings" ON public.system_settings
    FOR SELECT USING (true);

-- 2. Notification Preferences Policies
-- Students can only read/update their own preferences
CREATE POLICY "Students can select own preferences" ON public.notification_preferences
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Students can update own preferences" ON public.notification_preferences
    FOR UPDATE USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    ) WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );

-- 3. Notification History Policies
-- Students can only view their own notification history logs
CREATE POLICY "Students can view own notification history" ON public.notification_history
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );
```
