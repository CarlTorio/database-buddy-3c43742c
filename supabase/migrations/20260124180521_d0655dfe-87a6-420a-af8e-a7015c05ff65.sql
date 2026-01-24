-- Add UPDATE and DELETE policies for anon on members table
CREATE POLICY "Allow update for anon" ON public.members
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.members
    FOR DELETE USING (true);

-- Add UPDATE and DELETE policies for anon on patient_records table
CREATE POLICY "Allow update for anon" ON public.patient_records
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.patient_records
    FOR DELETE USING (true);

-- Add UPDATE and DELETE policies for anon on bookings table
CREATE POLICY "Allow update for anon" ON public.bookings
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.bookings
    FOR DELETE USING (true);

-- Fix Green membership benefits to match user requirements
-- Remove the consultation with 12 sessions and make it an inclusion again
UPDATE public.membership_benefits 
SET benefit_type = 'inclusion', total_quantity = 999
WHERE membership_type = 'Green' AND benefit_name = 'Consultation';

-- Add Celebrity Drip for Green if not exists
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) 
VALUES ('Green', 'Celebrity Drip', 'claimable', 1, 'Free Celebrity Drip session')
ON CONFLICT DO NOTHING;