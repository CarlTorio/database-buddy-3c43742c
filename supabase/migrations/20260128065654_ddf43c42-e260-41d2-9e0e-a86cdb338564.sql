
-- Remove unique constraint on email to allow multiple patient records with same email
-- First, find and drop the unique constraint/index on email
DROP INDEX IF EXISTS idx_patient_records_email;

-- Also check for any unique constraint
ALTER TABLE public.patient_records DROP CONSTRAINT IF EXISTS patient_records_email_key;

-- Add a new index (not unique) for performance
CREATE INDEX IF NOT EXISTS idx_patient_records_email_lookup ON public.patient_records(email);

-- Add unique constraint on member_id instead (each member should have only one patient record)
ALTER TABLE public.patient_records ADD CONSTRAINT patient_records_member_id_unique UNIQUE (member_id);
