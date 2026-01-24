-- Add patient_id to bookings (link booking to patient record)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES public.patient_records(id);

-- Add member_id to bookings (link booking to member for badge display)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id);

-- Add member_id to patient_records (link patient to their membership)
ALTER TABLE public.patient_records 
ADD COLUMN IF NOT EXISTS member_id UUID REFERENCES public.members(id);

-- Add source to patient_records (track where record came from)
ALTER TABLE public.patient_records 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_patient_records_email ON public.patient_records(email);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);