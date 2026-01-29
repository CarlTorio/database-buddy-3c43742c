-- Add UPDATE policy for anon on bookings (needed for status changes like "Add to History")
CREATE POLICY "Allow update for anon on bookings"
ON public.bookings
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Add DELETE policy for anon on bookings (needed for delete functionality)
CREATE POLICY "Allow delete for anon on bookings"
ON public.bookings
FOR DELETE
TO anon
USING (true);