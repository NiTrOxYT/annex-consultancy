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


-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;


-- 5. Policies
DROP POLICY IF EXISTS "Allow public read on system settings" ON public.system_settings;
CREATE POLICY "Allow public read on system settings" ON public.system_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can select own preferences" ON public.notification_preferences;
CREATE POLICY "Students can select own preferences" ON public.notification_preferences
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Students can update own preferences" ON public.notification_preferences;
CREATE POLICY "Students can update own preferences" ON public.notification_preferences
    FOR UPDATE USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    ) WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Students can view own notification history" ON public.notification_history;
CREATE POLICY "Students can view own notification history" ON public.notification_history
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        training_student_id IN (SELECT id FROM public.training_students WHERE auth_user_id = auth.uid())
    );
