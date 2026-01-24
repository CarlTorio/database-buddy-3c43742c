-- =============================================
-- ADD MISSING RLS POLICIES
-- =============================================

-- Add SELECT policy for anon on bookings
CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT TO anon USING (true);

-- Add SELECT policy for anon on members
CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);

-- Add SELECT and INSERT policies for anon on patient_records
CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);

-- Add SELECT policy for anon on transactions
CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT TO anon USING (true);