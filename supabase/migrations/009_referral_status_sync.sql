-- Create trigger function to automatically update referral status based on standard student stage updates
CREATE OR REPLACE FUNCTION public.sync_referral_status_from_student()
RETURNS TRIGGER AS $$
DECLARE
    mapped_status TEXT;
BEGIN
    -- Determine mapped referral status based on standard student's current_stage
    -- Standard Student current_stage values: 'Consultation', 'Documents Collection', 'University Shortlisting', 'Application Submission', 'Offer Letter Received', 'Tuition Payment', 'Visa Processing', 'Visa Approved', 'Enrolled'
    -- Referral status check values: 'lead', 'contacted', 'application_started', 'offer_received', 'visa_approved', 'enrolled', 'rewarded'
    IF NEW.current_stage = 'Consultation' OR NEW.current_stage = 'Documents Collection' OR NEW.current_stage = 'University Shortlisting' THEN
        mapped_status := 'contacted';
    ELSIF NEW.current_stage = 'Application Submission' THEN
        mapped_status := 'application_started';
    ELSIF NEW.current_stage = 'Offer Letter Received' OR NEW.current_stage = 'Tuition Payment' THEN
        mapped_status := 'offer_received';
    ELSIF NEW.current_stage = 'Visa Processing' OR NEW.current_stage = 'Visa Approved' THEN
        mapped_status := 'visa_approved';
    ELSIF NEW.current_stage = 'Enrolled' THEN
        mapped_status := 'enrolled';
    ELSE
        mapped_status := 'contacted';
    END IF;

    -- Update referral if referred_email matches the student's email
    -- Do not overwrite 'rewarded' status since rewards are finalized administrative actions
    UPDATE public.referrals
    SET status = mapped_status,
        updated_at = timezone('utc'::text, now())
    WHERE referred_email = NEW.email AND status NOT IN ('rewarded');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to public.students table
DROP TRIGGER IF EXISTS trg_sync_referral_status ON public.students;
CREATE TRIGGER trg_sync_referral_status
    AFTER INSERT OR UPDATE OF current_stage, email ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_referral_status_from_student();

-- Sync existing referrals to match currently registered student stages
UPDATE public.referrals r
SET status = 
    CASE 
        WHEN s.current_stage IN ('Consultation', 'Documents Collection', 'University Shortlisting') THEN 'contacted'
        WHEN s.current_stage = 'Application Submission' THEN 'application_started'
        WHEN s.current_stage IN ('Offer Letter Received', 'Tuition Payment') THEN 'offer_received'
        WHEN s.current_stage IN ('Visa Processing', 'Visa Approved') THEN 'visa_approved'
        WHEN s.current_stage = 'Enrolled' THEN 'enrolled'
        ELSE r.status
    END,
    updated_at = timezone('utc'::text, now())
FROM public.students s
WHERE r.referred_email = s.email AND r.status NOT IN ('rewarded');
