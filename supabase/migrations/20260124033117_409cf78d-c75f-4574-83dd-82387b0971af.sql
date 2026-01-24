-- Add new fields to patient_records for the enhanced patient profile
ALTER TABLE public.patient_records
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS emergency_contact text,
ADD COLUMN IF NOT EXISTS membership_join_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS membership_expiry_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS membership_status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS medical_records jsonb DEFAULT '[]'::jsonb;