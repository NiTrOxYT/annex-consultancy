-- 1. Add referral_code to students table if not exists
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Create trigger function to auto-generate unique referral code of format ANNEX-XXXX
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    -- If referral_code is already provided, keep it
    IF NEW.referral_code IS NOT NULL THEN
        RETURN NEW;
    END IF;
    
    LOOP
        -- Generate random 4-character hex sequence (ANNEX-XXXX)
        new_code := 'ANNEX-' || upper(substring(md5(random()::text) from 1 for 4));
        
        -- Verify uniqueness
        SELECT EXISTS (
            SELECT 1 FROM public.students WHERE referral_code = new_code
        ) INTO code_exists;
        
        IF NOT code_exists THEN
            NEW.referral_code := new_code;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to students table
DROP TRIGGER IF EXISTS trg_generate_referral_code ON public.students;
CREATE TRIGGER trg_generate_referral_code
    BEFORE INSERT ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_referral_code();

-- 3. Seed unique referral codes for all existing students
UPDATE public.students
SET referral_code = 'ANNEX-' || upper(substring(md5(id::text || random()::text) from 1 for 4))
WHERE referral_code IS NULL;

-- 4. Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    referral_code TEXT NOT NULL,
    referred_name TEXT NOT NULL,
    referred_email TEXT NOT NULL,
    referred_phone TEXT,
    preferred_country TEXT NOT NULL,
    preferred_intake TEXT NOT NULL,
    status TEXT DEFAULT 'lead' NOT NULL CHECK (status IN ('lead', 'contacted', 'application_started', 'offer_received', 'visa_approved', 'enrolled', 'rewarded')),
    reward_amount NUMERIC DEFAULT 0 NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 5. Create referral_rewards table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE NOT NULL UNIQUE,
    reward_type TEXT DEFAULT 'Cash' NOT NULL,
    reward_amount NUMERIC NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    notes TEXT
);

-- Enable RLS on referral_rewards
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Referrals Policies
DROP POLICY IF EXISTS "Students can view own referrals" ON public.referrals;
CREATE POLICY "Students can view own referrals" ON public.referrals
    FOR SELECT USING (
        referrer_student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid()) OR
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

DROP POLICY IF EXISTS "Allow public insert on referrals" ON public.referrals;
CREATE POLICY "Allow public insert on referrals" ON public.referrals
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Counselors can manage referrals" ON public.referrals;
CREATE POLICY "Counselors can manage referrals" ON public.referrals
    FOR ALL USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    ) WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- Referral Rewards Policies
DROP POLICY IF EXISTS "Students can view own rewards" ON public.referral_rewards;
CREATE POLICY "Students can view own rewards" ON public.referral_rewards
    FOR SELECT USING (
        referral_id IN (
            SELECT id FROM public.referrals 
            WHERE referrer_student_id IN (SELECT id FROM public.students WHERE auth_user_id = auth.uid())
        ) OR
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

DROP POLICY IF EXISTS "Counselors can manage rewards" ON public.referral_rewards;
CREATE POLICY "Counselors can manage rewards" ON public.referral_rewards
    FOR ALL USING (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    ) WITH CHECK (
        auth.uid() IN (SELECT auth_user_id FROM public.counselors WHERE is_active = true)
    );

-- 7. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_student_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_ref ON public.referral_rewards(referral_id);

-- Enable replication for realtime updates on referrals and rewards
ALTER PUBLICATION supabase_realtime ADD TABLE public.referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.referral_rewards;
