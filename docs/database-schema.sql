-- ===========================================================================
-- HILOMÈ WELLNESS RESORT DATABASE SCHEMA
-- Consolidated from supabase/migrations/
-- Last Updated: 2026-01-29
-- ===========================================================================
-- Migration History (43 files):
-- 1. 20260114155747 - Initial bookings, membership_applications, members tables
-- 2. 20260114173526 - Recreate with TEXT date columns
-- 3. 20260122063913 - Simplified schema with public access
-- 4. 20260122185947 - Consultation bookings and membership applications
-- 5. 20260123050204 - Stripe payment tracking columns
-- 6. 20260123064230 - Membership dates and referral system
-- 7. 20260123074018 - Patients table creation
-- 8. 20260123095902 - Bookings with contact_number
-- 9. 20260123190452 - Patient_records table
-- 10. 20260123195219 - Bookings and patient_records restructure
-- 11. 20260123201452 - Transactions table for payments
-- 12. 20260123202002 - Stripe receipt URL
-- 13. 20260123204844 - Core schema consolidation
-- 14. 20260123205337 - Members table with referral code generation
-- 15. 20260124033117 - Patient records enhancement
-- 16. 20260124142448 - Major schema consolidation
-- 17. 20260124144254 - Missing RLS policies
-- 18. 20260124151751 - Booking and patient record relationships
-- 19. 20260124155959 - Schema restructure with proper FK order
-- 20. 20260124162402 - Anon update/delete policies
-- 21. 20260124174442 - Final schema restructure
-- 22. 20260124175231 - Membership benefits system
-- 23. 20260124180521 - Additional anon policies and benefits fixes
-- 24. 20260124182403 - Complete schema with functions
-- 25. 20260124183057 - Membership benefits tables recreation
-- 26. 20260124183447 - Update policy for anon on members
-- 27. 20260124183905 - Delete policies for anon
-- 28. 20260124190158 - Final consolidated schema with seed data
-- 29. 20260125060308 - Schema verification and sync
-- 30. 20260125104107 - Schema restructure with proper FK order
-- 31. 20260125104647 - Additional UPDATE and DELETE policies for anon
-- 32. 20260125113803 - Final schema consolidation with RLS
-- 33. 20260127070053 - Add UPDATE policy for anon on patient_records
-- 34. 20260127074150 - Schema improvements
-- 35. 20260127075814 - Admin settings table
-- 36. 20260127083311 - Referral code generator update (6 letters)
-- 37. 20260128063303 - Complete schema rebuild
-- 38. 20260128065518 - Sync member to patient function update
-- 39. 20260128065654 - Remove email unique constraint, add member_id unique
-- 40. 20260128171543 - Final schema with all tables and functions
-- 41. 20260128173041 - Add UPDATE and DELETE policies for anon on members
-- 42. 20260129020055 - Add UPDATE and DELETE policies for anon on bookings
-- ===========================================================================


-- ===========================================================================
-- FUNCTION: Auto-update timestamps
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;


-- ===========================================================================
-- TABLE 1: MEMBERS
-- Stores membership subscriptions, payments, and referral tracking
-- ===========================================================================
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    membership_type TEXT NOT NULL DEFAULT 'Green',
    membership_start_date TEXT NOT NULL DEFAULT to_char(now(), 'YYYY-MM-DD'),
    membership_expiry_date TEXT DEFAULT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT DEFAULT NULL,
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    is_walk_in BOOLEAN NOT NULL DEFAULT false,
    referral_code TEXT DEFAULT NULL UNIQUE,
    referred_by TEXT DEFAULT NULL,
    referral_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for members
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_membership_type ON public.members(membership_type);
CREATE INDEX idx_members_referral_code ON public.members(referral_code);

-- RLS for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow update for anon on members" ON public.members 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon on members" ON public.members 
    FOR DELETE TO anon USING (true);

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for members timestamp
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- TABLE 2: BOOKINGS
-- Stores appointment/consultation bookings
-- ===========================================================================
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
    patient_id UUID DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for bookings
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);

-- RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on bookings" ON public.bookings
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon on bookings" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow update for anon on bookings" ON public.bookings 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon on bookings" ON public.bookings 
    FOR DELETE TO anon USING (true);

CREATE POLICY "Allow all for authenticated on bookings" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for bookings timestamp
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- TABLE 3: PATIENT_RECORDS
-- Stores patient medical records, demographics, and history
-- ===========================================================================
CREATE TABLE public.patient_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT DEFAULT NULL,
    date_of_birth TEXT DEFAULT NULL,
    age INTEGER DEFAULT NULL,
    gender TEXT DEFAULT NULL,
    emergency_contact TEXT DEFAULT NULL,
    membership TEXT DEFAULT NULL,
    membership_join_date TEXT DEFAULT NULL,
    membership_expiry_date TEXT DEFAULT NULL,
    membership_status TEXT DEFAULT NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    booking_id UUID DEFAULT NULL REFERENCES public.bookings(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'manual',
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    payment_method TEXT DEFAULT NULL,
    payment_status TEXT DEFAULT 'pending',
    amount_paid NUMERIC DEFAULT NULL,
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    medical_records JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT patient_records_member_id_unique UNIQUE (member_id)
);

-- Indexes for patient_records
CREATE INDEX idx_patient_records_email ON public.patient_records(email);
CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_booking_id ON public.patient_records(booking_id);
CREATE INDEX idx_patient_records_source ON public.patient_records(source);

-- RLS for patient_records
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on patient_records" ON public.patient_records
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon on patient_records" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow update for anon on patient_records" ON public.patient_records 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete for anon on patient_records" ON public.patient_records 
    FOR DELETE TO anon USING (true);

CREATE POLICY "Allow all for authenticated on patient_records" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for patient_records timestamp
CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK from bookings to patient_records (after patient_records exists)
ALTER TABLE public.bookings
    ADD CONSTRAINT fk_bookings_patient 
    FOREIGN KEY (patient_id) REFERENCES public.patient_records(id) ON DELETE SET NULL;


-- ===========================================================================
-- TABLE 4: TRANSACTIONS
-- Stores payment transactions for memberships and services
-- ===========================================================================
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PHP',
    payment_method TEXT NOT NULL DEFAULT 'cash',
    payment_status TEXT NOT NULL DEFAULT 'completed',
    stripe_payment_intent_id TEXT DEFAULT NULL,
    stripe_customer_id TEXT DEFAULT NULL,
    stripe_charge_id TEXT DEFAULT NULL,
    stripe_receipt_url TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    transaction_type TEXT NOT NULL DEFAULT 'membership_payment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for transactions
CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_payment_status ON public.transactions(payment_status);
CREATE INDEX idx_transactions_transaction_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on transactions" ON public.transactions
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated on transactions" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for transactions timestamp
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- TABLE 5: MEMBERSHIP_BENEFITS
-- Defines benefits available for each membership tier
-- ===========================================================================
CREATE TABLE public.membership_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_type TEXT NOT NULL,
    benefit_name TEXT NOT NULL,
    benefit_type TEXT NOT NULL DEFAULT 'claimable', -- 'inclusion' or 'claimable'
    total_quantity INTEGER NOT NULL DEFAULT 1,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for membership_benefits
CREATE INDEX idx_membership_benefits_type ON public.membership_benefits(membership_type);

-- RLS for membership_benefits
ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on benefits" ON public.membership_benefits 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated on benefits" ON public.membership_benefits 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for membership_benefits timestamp
CREATE TRIGGER update_membership_benefits_updated_at
    BEFORE UPDATE ON public.membership_benefits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- TABLE 6: MEMBER_BENEFIT_CLAIMS
-- Tracks which benefits a member has claimed
-- ===========================================================================
CREATE TABLE public.member_benefit_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    benefit_id UUID NOT NULL REFERENCES public.membership_benefits(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL DEFAULT 1,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    claimed_by TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    UNIQUE(member_id, benefit_id, session_number)
);

-- Indexes for member_benefit_claims
CREATE INDEX idx_member_benefit_claims_member ON public.member_benefit_claims(member_id);
CREATE INDEX idx_member_benefit_claims_benefit ON public.member_benefit_claims(benefit_id);

-- RLS for member_benefit_claims
ALTER TABLE public.member_benefit_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on claims" ON public.member_benefit_claims 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon on claims" ON public.member_benefit_claims 
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow delete for anon on claims" ON public.member_benefit_claims 
    FOR DELETE TO anon USING (true);

CREATE POLICY "Allow all for authenticated on claims" ON public.member_benefit_claims 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ===========================================================================
-- TABLE 7: REFERRAL_REWARDS
-- Tracks referral rewards earned by members
-- ===========================================================================
CREATE TABLE public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    reward_name TEXT NOT NULL,
    claimed BOOLEAN NOT NULL DEFAULT false,
    claimed_at TIMESTAMPTZ DEFAULT NULL,
    claimed_by TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for referral_rewards
CREATE INDEX idx_referral_rewards_member ON public.referral_rewards(member_id);

-- RLS for referral_rewards
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on rewards" ON public.referral_rewards 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow insert for anon on rewards" ON public.referral_rewards 
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow update for anon on rewards" ON public.referral_rewards 
    FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for authenticated on rewards" ON public.referral_rewards 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for referral_rewards timestamp
CREATE TRIGGER update_referral_rewards_updated_at
    BEFORE UPDATE ON public.referral_rewards
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- TABLE 8: ADMIN_SETTINGS
-- Stores application settings (e.g., admin password)
-- ===========================================================================
CREATE TABLE public.admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for admin_settings
CREATE INDEX idx_admin_settings_key ON public.admin_settings(setting_key);

-- RLS for admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on admin_settings" ON public.admin_settings 
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow all for authenticated on admin_settings" ON public.admin_settings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger for admin_settings timestamp
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ===========================================================================
-- FUNCTION: Generate unique referral code
-- Automatically generates a 6-letter referral code from member name
-- Example: "John Carl Torio" → "JOHNCA"
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  base_code TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get first 6 letters of name (removing spaces and non-alpha chars)
  base_code := UPPER(LEFT(REGEXP_REPLACE(COALESCE(NEW.name, 'MEMBER'), '[^a-zA-Z]', '', 'g'), 6));
  
  -- Pad with X if less than 6 characters
  base_code := RPAD(base_code, 6, 'X');
  
  -- Start with base code, add counter if collision
  new_code := base_code;
  
  LOOP
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
    counter := counter + 1;
    -- If collision, append number (e.g., JOHNCA1, JOHNCA2)
    new_code := LEFT(base_code, 6 - LENGTH(counter::TEXT)) || counter::TEXT;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_member_referral_code
    BEFORE INSERT ON public.members
    FOR EACH ROW
    WHEN (NEW.referral_code IS NULL)
    EXECUTE FUNCTION public.generate_referral_code();


-- ===========================================================================
-- FUNCTION: Sync member to patient record on activation
-- Creates/updates patient record when member becomes active
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.sync_member_to_patient()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When member status changes to 'active' (new member or status update)
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Check if patient record already exists for this member
    IF NOT EXISTS (SELECT 1 FROM public.patient_records WHERE member_id = NEW.id) THEN
      -- Insert new patient record
      INSERT INTO public.patient_records (
        name, email, contact_number, membership, 
        membership_join_date, membership_expiry_date, membership_status,
        member_id, source, payment_method, payment_status, amount_paid,
        stripe_customer_id, stripe_payment_intent_id, stripe_receipt_url
      ) VALUES (
        NEW.name, NEW.email, NEW.phone, NEW.membership_type,
        NEW.membership_start_date, NEW.membership_expiry_date, NEW.status,
        NEW.id, 'membership', NEW.payment_method, NEW.payment_status, NEW.amount_paid,
        NEW.stripe_customer_id, NEW.stripe_payment_intent_id, NEW.stripe_receipt_url
      );
    ELSE
      -- Update existing patient record
      UPDATE public.patient_records
      SET 
        name = NEW.name,
        email = NEW.email,
        contact_number = NEW.phone,
        membership = NEW.membership_type,
        membership_join_date = NEW.membership_start_date,
        membership_expiry_date = NEW.membership_expiry_date,
        membership_status = NEW.status,
        payment_method = NEW.payment_method,
        payment_status = NEW.payment_status,
        amount_paid = NEW.amount_paid,
        stripe_customer_id = NEW.stripe_customer_id,
        stripe_payment_intent_id = NEW.stripe_payment_intent_id,
        stripe_receipt_url = NEW.stripe_receipt_url,
        updated_at = now()
      WHERE member_id = NEW.id;
    END IF;
  END IF;
  
  -- When already active member is updated (keep patient record in sync)
  IF NEW.status = 'active' AND OLD IS NOT NULL AND OLD.status = 'active' THEN
    UPDATE public.patient_records
    SET 
      name = NEW.name,
      email = NEW.email,
      contact_number = NEW.phone,
      membership = NEW.membership_type,
      membership_join_date = NEW.membership_start_date,
      membership_expiry_date = NEW.membership_expiry_date,
      membership_status = NEW.status,
      updated_at = now()
    WHERE member_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_member_to_patient_trigger
    AFTER INSERT OR UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient();


-- ===========================================================================
-- SEED DATA: Admin Password
-- ===========================================================================
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
    ('admin_password', 'HILOME2026');


-- ===========================================================================
-- SEED DATA: Membership Benefits
-- ===========================================================================
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
    -- Green Membership Benefits
    ('Green', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Green', 'Celebrity Drip', 'claimable', 1, 'Free Celebrity Drip session'),
    -- Gold Membership Benefits
    ('Gold', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Gold', 'Celebrity Drip', 'claimable', 2, 'Free Celebrity Drip sessions'),
    ('Gold', 'Massage', 'claimable', 5, 'Free massage sessions'),
    -- Platinum Membership Benefits
    ('Platinum', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Platinum', 'Celebrity Drip', 'claimable', 4, 'Free Celebrity Drip sessions'),
    ('Platinum', 'Massage', 'claimable', 12, 'Free massage sessions'),
    ('Platinum', 'Facial', 'claimable', 4, 'Free facial treatments');


-- ===========================================================================
-- RELATIONSHIPS SUMMARY
-- ===========================================================================
-- members.referral_code       -> unique identifier for referrals
-- patient_records.member_id   -> members.id (link patient to membership)
-- patient_records.booking_id  -> bookings.id (original booking reference)
-- bookings.patient_id         -> patient_records.id (link booking to patient)
-- bookings.member_id          -> members.id (link booking to member)
-- transactions.member_id      -> members.id (link transaction to member)
-- member_benefit_claims.member_id  -> members.id (who claimed)
-- member_benefit_claims.benefit_id -> membership_benefits.id (what was claimed)
-- referral_rewards.member_id  -> members.id (who earned the reward)
-- ===========================================================================
