-- Migration: Create email_logs table for auditing system notifications
-- Supports tracking status: sent, delivered, failed

CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
    message_id TEXT, -- SMTP messageId returned by Brevo
    error_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select email_logs" ON public.email_logs;
DROP POLICY IF EXISTS "Allow public write email_logs" ON public.email_logs;

CREATE POLICY "Allow public select email_logs" ON public.email_logs FOR SELECT USING (true);
CREATE POLICY "Allow public write email_logs" ON public.email_logs FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);
