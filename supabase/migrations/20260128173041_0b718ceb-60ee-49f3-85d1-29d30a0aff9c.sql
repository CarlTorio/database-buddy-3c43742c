-- Add UPDATE and DELETE policies for anon on members table
CREATE POLICY "Allow update for anon on members" 
  ON public.members 
  FOR UPDATE 
  TO anon 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow delete for anon on members" 
  ON public.members 
  FOR DELETE 
  TO anon 
  USING (true);