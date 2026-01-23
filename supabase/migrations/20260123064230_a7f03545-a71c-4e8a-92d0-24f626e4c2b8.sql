-- Add membership dates and referral tracking columns
ALTER TABLE public.members
ADD COLUMN membership_start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN membership_expiry_date DATE,
ADD COLUMN referral_code TEXT UNIQUE,
ADD COLUMN referral_count INTEGER DEFAULT 0;

-- Create function to generate unique 6-character referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
  code_exists BOOLEAN;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = result) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Create trigger to auto-generate referral code on insert
CREATE OR REPLACE FUNCTION public.set_member_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Generate referral code if not provided
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  
  -- Set start date if not provided
  IF NEW.membership_start_date IS NULL THEN
    NEW.membership_start_date := CURRENT_DATE;
  END IF;
  
  -- Calculate expiry date (1 year from start) if not provided
  IF NEW.membership_expiry_date IS NULL THEN
    NEW.membership_expiry_date := NEW.membership_start_date + INTERVAL '1 year';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_member_defaults
BEFORE INSERT ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.set_member_defaults();