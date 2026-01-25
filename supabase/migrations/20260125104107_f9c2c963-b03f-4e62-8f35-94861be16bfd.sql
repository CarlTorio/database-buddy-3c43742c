-- ===========================================================================
-- HILOMÈ CLINIC DATABASE SCHEMA
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

CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_members_membership_type ON public.members(membership_type);
CREATE INDEX idx_members_referral_code ON public.members(referral_code);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT TO anon USING (true);
CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 2: PATIENT_RECORDS (created before bookings for FK reference)
-- ===========================================================================
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
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    booking_id UUID DEFAULT NULL,
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_records_email ON public.patient_records(email);
CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_source ON public.patient_records(source);

ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT TO anon USING (true);
CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 3: BOOKINGS
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
    patient_id UUID DEFAULT NULL REFERENCES public.patient_records(id) ON DELETE SET NULL,
    member_id UUID DEFAULT NULL REFERENCES public.members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_preferred_date ON public.bookings(preferred_date);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT TO anon USING (true);
CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add FK from patient_records to bookings
ALTER TABLE public.patient_records
    ADD CONSTRAINT fk_patient_records_booking 
    FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;

CREATE INDEX idx_patient_records_booking_id ON public.patient_records(booking_id);

-- ===========================================================================
-- TABLE 4: TRANSACTIONS
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

CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_payment_status ON public.transactions(payment_status);
CREATE INDEX idx_transactions_transaction_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT TO anon USING (true);
CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 5: MEMBERSHIP_BENEFITS
-- ===========================================================================
CREATE TABLE public.membership_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_type TEXT NOT NULL,
    benefit_name TEXT NOT NULL,
    benefit_type TEXT NOT NULL DEFAULT 'claimable',
    total_quantity INTEGER NOT NULL DEFAULT 1,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_membership_benefits_type ON public.membership_benefits(membership_type);

ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on benefits" ON public.membership_benefits 
    FOR SELECT USING (true);
CREATE POLICY "Allow all for authenticated on benefits" ON public.membership_benefits 
    FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_membership_benefits_updated_at
    BEFORE UPDATE ON public.membership_benefits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- TABLE 6: MEMBER_BENEFIT_CLAIMS
-- ===========================================================================
CREATE TABLE public.member_benefit_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    benefit_id UUID NOT NULL REFERENCES public.membership_benefits(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    claimed_by TEXT DEFAULT NULL,
    UNIQUE(member_id, benefit_id, session_number)
);

CREATE INDEX idx_member_benefit_claims_member ON public.member_benefit_claims(member_id);
CREATE INDEX idx_member_benefit_claims_benefit ON public.member_benefit_claims(benefit_id);

ALTER TABLE public.member_benefit_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on claims" ON public.member_benefit_claims 
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon on claims" ON public.member_benefit_claims 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete for anon on claims" ON public.member_benefit_claims 
    FOR DELETE USING (true);
CREATE POLICY "Allow all for authenticated on claims" ON public.member_benefit_claims 
    FOR ALL USING (true) WITH CHECK (true);

-- ===========================================================================
-- TABLE 7: REFERRAL_REWARDS
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

CREATE INDEX idx_referral_rewards_member ON public.referral_rewards(member_id);

ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for anon on rewards" ON public.referral_rewards 
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon on rewards" ON public.referral_rewards 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for anon on rewards" ON public.referral_rewards 
    FOR UPDATE USING (true);
CREATE POLICY "Allow all for authenticated on rewards" ON public.referral_rewards 
    FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_referral_rewards_updated_at
    BEFORE UPDATE ON public.referral_rewards
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- FUNCTION: Generate unique referral code
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.referral_code IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  LOOP
    new_code := UPPER(LEFT(REGEXP_REPLACE(COALESCE(NEW.name, 'USER'), '[^a-zA-Z]', '', 'g'), 4));
    new_code := new_code || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
    
    SELECT EXISTS(SELECT 1 FROM public.members WHERE referral_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_member_referral_code
    BEFORE INSERT ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_referral_code();

-- ===========================================================================
-- FUNCTION: Sync member to patient record on activation
-- ===========================================================================
CREATE OR REPLACE FUNCTION public.sync_member_to_patient()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    IF NOT EXISTS (SELECT 1 FROM public.patient_records WHERE email = NEW.email) THEN
      INSERT INTO public.patient_records (
        name, email, contact_number, membership, 
        membership_join_date, membership_expiry_date, membership_status,
        member_id, source
      ) VALUES (
        NEW.name, NEW.email, NEW.phone, NEW.membership_type,
        NEW.membership_start_date, NEW.membership_expiry_date, NEW.status,
        NEW.id, 'membership'
      );
    ELSE
      UPDATE public.patient_records
      SET member_id = NEW.id,
          membership = NEW.membership_type,
          membership_join_date = NEW.membership_start_date,
          membership_expiry_date = NEW.membership_expiry_date,
          membership_status = NEW.status,
          updated_at = now()
      WHERE email = NEW.email AND member_id IS NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_sync_member_to_patient
    AFTER UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient();

-- ===========================================================================
-- SEED DATA: Default Membership Benefits
-- ===========================================================================
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
('Green', 'Discount on all services', 'inclusion', 1, '10% discount on all services'),
('Green', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Green', 'Free Facial', 'claimable', 2, 'Free facial treatment sessions'),
('Green', 'Free Consultation', 'claimable', 4, 'Free consultation sessions'),
('Green', 'Celebrity Drip', 'claimable', 1, 'Free Celebrity Drip session'),
('Gold', 'Discount on all services', 'inclusion', 1, '15% discount on all services'),
('Gold', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Gold', 'Free Facial', 'claimable', 4, 'Free facial treatment sessions'),
('Gold', 'Free Consultation', 'claimable', 6, 'Free consultation sessions'),
('Gold', 'Free Diamond Peel', 'claimable', 2, 'Free diamond peel sessions'),
('Platinum', 'Discount on all services', 'inclusion', 1, '20% discount on all services'),
('Platinum', 'Priority booking', 'inclusion', 1, 'Priority booking for appointments'),
('Platinum', 'VIP lounge access', 'inclusion', 1, 'Access to VIP lounge'),
('Platinum', 'Free Facial', 'claimable', 6, 'Free facial treatment sessions'),
('Platinum', 'Free Consultation', 'claimable', 12, 'Free consultation sessions'),
('Platinum', 'Free Diamond Peel', 'claimable', 4, 'Free diamond peel sessions'),
('Platinum', 'Free Slimming Session', 'claimable', 2, 'Free body slimming sessions');