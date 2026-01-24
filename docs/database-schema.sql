-- ===========================================================================
-- HILOMÈ DATABASE SCHEMA - CONSOLIDATED
-- Database: PostgreSQL (Supabase/Lovable Cloud)
-- Generated: 2026-01-24
-- ===========================================================================
-- This file consolidates all migrations in chronological order.
-- ===========================================================================

-- ===========================================================================
-- MIGRATION 1: 20260114155747 - Initial Schema
-- ===========================================================================

-- Create bookings table for consultation bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create membership_applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table for approved applications
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_payment DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE NOT NULL,
  total_paid INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for submissions)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update bookings"
  ON public.bookings FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can create applications"
  ON public.membership_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view applications"
  ON public.membership_applications FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update applications"
  ON public.membership_applications FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete applications"
  ON public.membership_applications FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view members"
  ON public.members FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create members"
  ON public.members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update members"
  ON public.members FOR UPDATE
  USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- MIGRATION 2: 20260114173526 - Schema Modifications
-- ===========================================================================

-- Recreate bookings table with TEXT dates
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recreate members table with TEXT dates
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  join_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  expiration_date TEXT NOT NULL,
  last_payment TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  total_paid NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recreate membership_applications table
CREATE TABLE public.membership_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  membership TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  message TEXT,
  applied_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert membership applications" 
ON public.membership_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view members" 
ON public.members 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view membership applications" 
ON public.membership_applications 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert members" 
ON public.members 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update members" 
ON public.members 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can update membership applications" 
ON public.membership_applications 
FOR UPDATE 
USING (true);


-- ===========================================================================
-- MIGRATION 3: 20260122063913 - Additional Policies
-- ===========================================================================

-- Enable RLS on all tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bookings" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read applications" ON public.membership_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert applications" ON public.membership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update applications" ON public.membership_applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete applications" ON public.membership_applications FOR DELETE USING (true);

CREATE POLICY "Allow public read members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow public insert members" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update members" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete members" ON public.members FOR DELETE USING (true);


-- ===========================================================================
-- MIGRATION 4: 20260122185947 - Schema Restructure
-- ===========================================================================

-- Create members table with membership_type
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  membership_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


-- ===========================================================================
-- MIGRATION 5: 20260123050204 - Stripe Payment Tracking
-- ===========================================================================

-- Add Stripe payment tracking columns to members table
ALTER TABLE public.members
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_payment_intent_id text,
ADD COLUMN payment_method_type text,
ADD COLUMN payment_method_details text;

-- Add comments for clarity
COMMENT ON COLUMN public.members.stripe_customer_id IS 'Stripe customer ID for recurring payments';
COMMENT ON COLUMN public.members.stripe_payment_intent_id IS 'Stripe payment intent or checkout session ID';
COMMENT ON COLUMN public.members.payment_method_type IS 'Payment method type: card, gcash, grabpay, bank_transfer, etc.';
COMMENT ON COLUMN public.members.payment_method_details IS 'Human-readable payment details like "Visa •••• 4242" or "GCash"';


-- ===========================================================================
-- MIGRATION 6: 20260123064230 - Referral System
-- ===========================================================================

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


-- ===========================================================================
-- MIGRATION 7: 20260123074018 - Patients Table
-- ===========================================================================

-- Create patients table for patient records
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact TEXT,
  membership_type TEXT,
  membership_start_date DATE,
  membership_expiry_date DATE,
  last_visit DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (admin portal)
CREATE POLICY "Anyone can view patients" 
ON public.patients 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update patients" 
ON public.patients 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add used_referral_code column to members table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS used_referral_code TEXT;


-- ===========================================================================
-- MIGRATION 8: 20260123095902 - Bookings Restructure
-- ===========================================================================

-- Create bookings table with contact_number
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Not a member',
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can book)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public select
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- MIGRATION 9: 20260123190452 - Patient Records Table
-- ===========================================================================

-- Create a separate patient_records table
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Not a member',
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create policies for patient_records
CREATE POLICY "Anyone can view patient records" 
ON public.patient_records 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create patient records" 
ON public.patient_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update patient records" 
ON public.patient_records 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete patient records" 
ON public.patient_records 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_patient_records_updated_at
BEFORE UPDATE ON public.patient_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- MIGRATION 10: 20260123195219 - Bookings and Patient Records
-- ===========================================================================

-- Create bookings table with TEXT dates
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Green',
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_records table with TEXT dates
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT NOT NULL DEFAULT 'Green',
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON public.patient_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- MIGRATION 11: 20260123201452 - Transactions Table
-- ===========================================================================

-- Create transactions table for payment tracking (Stripe-ready)
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES public.patient_records(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PHP',
  payment_method TEXT NOT NULL DEFAULT 'cash',
  payment_status TEXT NOT NULL DEFAULT 'completed',
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  stripe_charge_id TEXT,
  description TEXT,
  transaction_type TEXT NOT NULL DEFAULT 'membership_payment',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Anyone can view transactions"
ON public.transactions
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create transactions"
ON public.transactions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update transactions"
ON public.transactions
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add payment columns to patient_records
ALTER TABLE public.patient_records
ADD COLUMN payment_method TEXT DEFAULT 'cash',
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN amount_paid DECIMAL(10,2);


-- ===========================================================================
-- MIGRATION 12: 20260123202002 - Stripe Receipt URL
-- ===========================================================================

-- Add Stripe receipt URL to transactions table
ALTER TABLE public.transactions
ADD COLUMN stripe_receipt_url TEXT;

-- Add Stripe fields to patient_records
ALTER TABLE public.patient_records
ADD COLUMN stripe_payment_intent_id TEXT,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_receipt_url TEXT;


-- ===========================================================================
-- MIGRATION 13: 20260123204844 - Core Schema
-- ===========================================================================

-- Create bookings table for consultation bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  membership TEXT,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_records table for tracking patient history
CREATE TABLE public.patient_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT,
  membership TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  message TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table for payment tracking
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;


-- ===========================================================================
-- MIGRATION 14: 20260123205337 - Members Table
-- ===========================================================================

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

-- Create policies for members
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


-- ===========================================================================
-- MIGRATION 15: 20260124033117 - Patient Records Enhancement
-- ===========================================================================

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


-- ===========================================================================
-- MIGRATION 16: 20260124142448 - Major Schema Consolidation
-- ===========================================================================

-- TABLE 1: MEMBERS (created first - no dependencies)
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    membership_type TEXT NOT NULL DEFAULT 'green',
    membership_start_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    membership_expiry_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    is_walk_in BOOLEAN NOT NULL DEFAULT false,
    referral_code TEXT DEFAULT NULL,
    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_email ON public.members(email);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);

-- TABLE 2: PATIENT_RECORDS (depends on members)
CREATE TABLE public.patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT DEFAULT NULL,
    date_of_birth TEXT DEFAULT NULL,
    age INTEGER DEFAULT NULL,
    gender TEXT DEFAULT NULL,
    emergency_contact TEXT DEFAULT NULL,
    membership TEXT DEFAULT NULL,
    membership_join_date TEXT DEFAULT NULL,
    membership_expiry_date TEXT DEFAULT NULL,
    membership_status TEXT DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    booking_id UUID DEFAULT NULL,
    source TEXT DEFAULT 'manual',
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    medical_records JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_email ON public.patient_records(email);

ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT TO anon USING (true);

-- TABLE 3: BOOKINGS (depends on members and patient_records)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    membership TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    patient_id UUID DEFAULT NULL REFERENCES public.patient_records(id),
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_email ON public.bookings(email);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT TO anon USING (true);

-- Add FK from patient_records to bookings
ALTER TABLE public.patient_records 
    ADD CONSTRAINT patient_records_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id);

-- TABLE 4: TRANSACTIONS (depends on members)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT TO anon USING (true);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_member_to_patient_record()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        INSERT INTO public.patient_records (
            name,
            email,
            contact_number,
            membership,
            membership_join_date,
            membership_expiry_date,
            membership_status,
            member_id,
            source
        )
        VALUES (
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.membership_type,
            NEW.membership_start_date,
            NEW.membership_expiry_date,
            NEW.status,
            NEW.id,
            'membership_purchase'
        )
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            contact_number = EXCLUDED.contact_number,
            membership = EXCLUDED.membership,
            membership_join_date = EXCLUDED.membership_join_date,
            membership_expiry_date = EXCLUDED.membership_expiry_date,
            membership_status = EXCLUDED.membership_status,
            member_id = EXCLUDED.member_id,
            source = COALESCE(patient_records.source, EXCLUDED.source),
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$function$;

-- TRIGGERS
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER sync_member_to_patient
    AFTER INSERT OR UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient_record();


-- ===========================================================================
-- MIGRATION 17: 20260124144254 - Additional RLS Policies
-- ===========================================================================

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


-- ===========================================================================
-- MIGRATION 18: 20260124151751 - Booking and Patient Record Relationships
-- ===========================================================================

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

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON public.bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(email);
CREATE INDEX IF NOT EXISTS idx_patient_records_email ON public.patient_records(email);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);


-- ===========================================================================
-- MIGRATION 19: 20260124155959 - Final Schema Consolidation
-- ===========================================================================

-- TABLE 1: MEMBERS (created first - no dependencies)
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    membership_type TEXT NOT NULL DEFAULT 'green',
    membership_start_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    membership_expiry_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    is_walk_in BOOLEAN NOT NULL DEFAULT false,
    referral_code TEXT DEFAULT NULL,
    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_email ON public.members(email);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);

-- TABLE 2: PATIENT_RECORDS (depends on members)
CREATE TABLE public.patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contact_number TEXT DEFAULT NULL,
    date_of_birth TEXT DEFAULT NULL,
    age INTEGER DEFAULT NULL,
    gender TEXT DEFAULT NULL,
    emergency_contact TEXT DEFAULT NULL,
    membership TEXT DEFAULT NULL,
    membership_join_date TEXT DEFAULT NULL,
    membership_expiry_date TEXT DEFAULT NULL,
    membership_status TEXT DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    booking_id UUID DEFAULT NULL,
    source TEXT DEFAULT 'manual',
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    medical_records JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_email ON public.patient_records(email);

ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT TO anon USING (true);

-- TABLE 3: BOOKINGS (depends on members and patient_records)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    membership TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    patient_id UUID DEFAULT NULL REFERENCES public.patient_records(id),
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_email ON public.bookings(email);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT TO anon USING (true);

-- Add FK from patient_records to bookings
ALTER TABLE public.patient_records 
    ADD CONSTRAINT patient_records_booking_id_fkey 
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id);

-- TABLE 4: TRANSACTIONS (depends on members)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT TO anon USING (true);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_member_to_patient_record()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
        INSERT INTO public.patient_records (
            name,
            email,
            contact_number,
            membership,
            membership_join_date,
            membership_expiry_date,
            membership_status,
            member_id,
            source
        )
        VALUES (
            NEW.name,
            NEW.email,
            NEW.phone,
            NEW.membership_type,
            NEW.membership_start_date,
            NEW.membership_expiry_date,
            NEW.status,
            NEW.id,
            'membership_purchase'
        )
        ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            contact_number = EXCLUDED.contact_number,
            membership = EXCLUDED.membership,
            membership_join_date = EXCLUDED.membership_join_date,
            membership_expiry_date = EXCLUDED.membership_expiry_date,
            membership_status = EXCLUDED.membership_status,
            member_id = EXCLUDED.member_id,
            source = COALESCE(patient_records.source, EXCLUDED.source),
            updated_at = now();
    END IF;
    RETURN NEW;
END;
$function$;

-- TRIGGERS
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER sync_member_to_patient
    AFTER INSERT OR UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient_record();


-- ===========================================================================
-- MIGRATION 20: 20260124162402 - Anon Update/Delete Policies
-- ===========================================================================

-- Add UPDATE and DELETE policies for anon users on members table
-- This allows the admin dashboard to work without authentication
CREATE POLICY "Allow update for anon" ON public.members
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.members
    FOR DELETE TO anon USING (true);

-- Same for patient_records
CREATE POLICY "Allow update for anon" ON public.patient_records
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon" ON public.patient_records
    FOR DELETE TO anon USING (true);


-- ===========================================================================
-- END OF CONSOLIDATED SCHEMA
-- ===========================================================================
