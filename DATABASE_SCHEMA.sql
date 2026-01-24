-- ===========================================================================
-- HILOMÈ DATABASE SCHEMA
-- Database: PostgreSQL (Supabase/Lovable Cloud)
-- Last Updated: 2026-01-24
-- ===========================================================================

-- ===========================================================================
-- TABLE 1: BOOKINGS
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
    patient_id UUID DEFAULT NULL REFERENCES public.patient_records(id),
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for bookings
CREATE INDEX idx_bookings_patient_id ON public.bookings(patient_id);
CREATE INDEX idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX idx_bookings_email ON public.bookings(email);

-- RLS Policies for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.bookings
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.bookings
    FOR SELECT USING (true);


-- ===========================================================================
-- TABLE 2: MEMBERS
-- Stores membership subscriptions and payments
-- ===========================================================================
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

-- Indexes for members
CREATE INDEX idx_members_email ON public.members(email);

-- RLS Policies for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.members
    FOR SELECT USING (true);


-- ===========================================================================
-- TABLE 3: PATIENT_RECORDS
-- Stores patient/client information and medical records
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
    member_id UUID DEFAULT NULL REFERENCES public.members(id),
    booking_id UUID DEFAULT NULL REFERENCES public.bookings(id),
    source TEXT DEFAULT 'manual',
    preferred_date TEXT DEFAULT NULL,
    preferred_time TEXT DEFAULT NULL,
    message TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    medical_records JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for patient_records
CREATE INDEX idx_patient_records_member_id ON public.patient_records(member_id);
CREATE INDEX idx_patient_records_email ON public.patient_records(email);

-- RLS Policies for patient_records
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.patient_records
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon" ON public.patient_records
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.patient_records
    FOR SELECT USING (true);


-- ===========================================================================
-- TABLE 4: TRANSACTIONS
-- Stores payment transactions
-- ===========================================================================
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

-- RLS Policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.transactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.transactions
    FOR SELECT USING (true);


-- ===========================================================================
-- FUNCTIONS
-- ===========================================================================

-- Function: Update updated_at column automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Function: Sync member to patient record when member becomes active
CREATE OR REPLACE FUNCTION public.sync_member_to_patient_record()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Only sync when member status changes to 'active'
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


-- ===========================================================================
-- TRIGGERS
-- ===========================================================================

-- Trigger: Auto-update updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on members
CREATE TRIGGER update_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Auto-update updated_at on patient_records
CREATE TRIGGER update_patient_records_updated_at
    BEFORE UPDATE ON public.patient_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Sync member to patient record when activated
CREATE TRIGGER sync_member_to_patient
    AFTER INSERT OR UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_member_to_patient_record();


-- ===========================================================================
-- RELATIONSHIPS SUMMARY
-- ===========================================================================
-- bookings.patient_id -> patient_records.id (link booking to patient)
-- bookings.member_id -> members.id (link booking to member)
-- patient_records.member_id -> members.id (link patient to membership)
-- patient_records.booking_id -> bookings.id (original booking reference)
-- transactions.member_id -> members.id (link transaction to member)
-- ===========================================================================
