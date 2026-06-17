-- Migration: Add auth_user_id column to students table
-- Purpose: Decouple students.id (primary key) from auth.users.id
-- The students table previously assumed id = auth.users.id, which broke
-- when records were manually created with different UUIDs.

-- Step 1a: Add the auth_user_id column
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Step 1b: Set default for students.id so new inserts auto-generate UUIDs
ALTER TABLE public.students
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 2: Backfill auth_user_id for records where students.id WAS the auth user ID.
-- For ALL existing records, we copy id → auth_user_id since the original design
-- intended id to match auth.users.id.
-- For the mismatched account (sourikaich7@gmail.com), you must manually update below.
UPDATE public.students
SET auth_user_id = id
WHERE auth_user_id IS NULL;

-- Step 3: Fix the known mismatched account.
-- Student email: sourikaich7@gmail.com
-- Student record id: 3808807f-81e4-4f88-a814-735c1338460c (arbitrary UUID, NOT auth ID)
-- Auth user id: 9f6ff751-1723-4e05-93e1-28b6561a04bf (actual Supabase Auth ID)
UPDATE public.students
SET auth_user_id = '9f6ff751-1723-4e05-93e1-28b6561a04bf'
WHERE email = 'sourikaich7@gmail.com';

-- Step 4: Create a unique index for fast login lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_auth_user_id
ON public.students (auth_user_id);

-- Verification: Check the result
-- SELECT id, email, auth_user_id FROM public.students;
