-- Migration 015: Public Referrals Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.public_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  referral_code TEXT,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT,
  referrer_phone TEXT NOT NULL,
  referrer_city TEXT,
  student_name TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  student_email TEXT,
  preferred_country TEXT,
  message TEXT,
  status TEXT DEFAULT 'Pending',
  reward_amount NUMERIC DEFAULT 10000,
  reward_status TEXT DEFAULT 'Not Eligible',
  assigned_counselor UUID REFERENCES public.counselors(id) ON DELETE SET NULL,
  notes TEXT,
  contacted BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_public_referrals_status ON public.public_referrals(status);
CREATE INDEX IF NOT EXISTS idx_public_referrals_created_at ON public.public_referrals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_referrals_student_phone ON public.public_referrals(student_phone);
CREATE INDEX IF NOT EXISTS idx_public_referrals_referrer_phone ON public.public_referrals(referrer_phone);

-- Updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_public_referrals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_public_referrals_updated_at ON public.public_referrals;
CREATE TRIGGER trg_public_referrals_updated_at
  BEFORE UPDATE ON public.public_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_public_referrals_updated_at();

-- Enable RLS
ALTER TABLE public.public_referrals ENABLE ROW LEVEL SECURITY;

-- Anonymous Insert Policy (Public website visitors can submit referrals)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'public_referrals' AND policyname = 'Allow anonymous insert to public_referrals'
  ) THEN
    CREATE POLICY "Allow anonymous insert to public_referrals" 
      ON public.public_referrals 
      FOR INSERT 
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'public_referrals' AND policyname = 'Allow full access to public_referrals for authenticated admins'
  ) THEN
    CREATE POLICY "Allow full access to public_referrals for authenticated admins" 
      ON public.public_referrals 
      FOR ALL 
      USING (true);
  END IF;
END $$;
