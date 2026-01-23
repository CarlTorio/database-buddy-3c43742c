-- Create members table for registered members
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  membership_type TEXT NOT NULL DEFAULT 'Green',
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'paid',
  amount_paid NUMERIC,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  referral_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  is_walk_in BOOLEAN NOT NULL DEFAULT false,
  membership_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  membership_expiry_date TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  stripe_receipt_url TEXT,
  stripe_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for members (public for now, will be restricted with admin auth later)
CREATE POLICY "Anyone can view members" 
ON public.members 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create members" 
ON public.members 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update members" 
ON public.members 
FOR UPDATE 
USING (true);

-- Update transactions table to reference members
ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_member 
FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE SET NULL;

-- Create trigger for automatic timestamp updates on members
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code from first 4 letters of name + random 2 digits
    new_code := UPPER(LEFT(REGEXP_REPLACE(NEW.name, '[^a-zA-Z]', '', 'g'), 4)) || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate referral code on insert
CREATE TRIGGER generate_member_referral_code
BEFORE INSERT ON public.members
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION public.generate_referral_code();