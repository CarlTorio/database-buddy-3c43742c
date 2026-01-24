-- ===========================================================================
-- MEMBERSHIP BENEFITS TRACKING SYSTEM
-- Tracks claimable products/services per membership tier
-- ===========================================================================

-- Table: Membership benefits definitions (what each tier includes)
CREATE TABLE public.membership_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    membership_type TEXT NOT NULL, -- 'Green', 'Gold', 'Platinum'
    benefit_name TEXT NOT NULL,
    benefit_type TEXT NOT NULL DEFAULT 'claimable', -- 'claimable' or 'inclusion'
    total_quantity INTEGER NOT NULL DEFAULT 1, -- Total allowed claims (e.g., 5 massages)
    description TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for membership_benefits
CREATE INDEX idx_membership_benefits_type ON public.membership_benefits(membership_type);

-- RLS Policies for membership_benefits
ALTER TABLE public.membership_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.membership_benefits
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.membership_benefits
    FOR SELECT USING (true);

-- Table: Member benefit claims (tracks which benefits a member has claimed)
CREATE TABLE public.member_benefit_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    benefit_id UUID NOT NULL REFERENCES public.membership_benefits(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL DEFAULT 1, -- Which session (1st, 2nd, etc.)
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    claimed_by TEXT DEFAULT NULL, -- Admin who marked it as claimed
    notes TEXT DEFAULT NULL,
    UNIQUE(member_id, benefit_id, session_number)
);

-- Indexes for member_benefit_claims
CREATE INDEX idx_member_benefit_claims_member ON public.member_benefit_claims(member_id);
CREATE INDEX idx_member_benefit_claims_benefit ON public.member_benefit_claims(benefit_id);

-- RLS Policies for member_benefit_claims
ALTER TABLE public.member_benefit_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.member_benefit_claims
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.member_benefit_claims
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for anon" ON public.member_benefit_claims
    FOR INSERT WITH CHECK (true);

-- Table: Referral rewards (manually added rewards from referrals)
CREATE TABLE public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    reward_name TEXT NOT NULL,
    claimed BOOLEAN NOT NULL DEFAULT false,
    claimed_at TIMESTAMPTZ DEFAULT NULL,
    claimed_by TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    notes TEXT DEFAULT NULL
);

-- Indexes for referral_rewards
CREATE INDEX idx_referral_rewards_member ON public.referral_rewards(member_id);

-- RLS Policies for referral_rewards
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated" ON public.referral_rewards
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow select for anon" ON public.referral_rewards
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for anon" ON public.referral_rewards
    FOR INSERT WITH CHECK (true);

-- Trigger for auto-updating updated_at on membership_benefits
CREATE TRIGGER update_membership_benefits_updated_at
    BEFORE UPDATE ON public.membership_benefits
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================================================
-- SEED DEFAULT MEMBERSHIP BENEFITS
-- ===========================================================================

-- Green Membership Benefits
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
    ('Green', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Green', 'Member Discount', 'inclusion', 999, '10% off on all services');

-- Gold Membership Benefits
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
    ('Gold', 'Vanity Fit Drip', 'claimable', 2, 'Free Vanity Fit Drip sessions'),
    ('Gold', '1 Hour Massage', 'claimable', 5, 'Free 1-hour massage sessions'),
    ('Gold', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Gold', 'Member Discount', 'inclusion', 999, '15% off on all services');

-- Platinum Membership Benefits
INSERT INTO public.membership_benefits (membership_type, benefit_name, benefit_type, total_quantity, description) VALUES
    ('Platinum', 'Vanity Fit Drip', 'claimable', 4, 'Free Vanity Fit Drip sessions'),
    ('Platinum', '1 Hour Massage', 'claimable', 10, 'Free 1-hour massage sessions'),
    ('Platinum', 'Diamond Peel', 'claimable', 3, 'Free Diamond Peel sessions'),
    ('Platinum', 'Consultation', 'inclusion', 999, 'Unlimited consultations'),
    ('Platinum', 'Member Discount', 'inclusion', 999, '20% off on all services'),
    ('Platinum', 'Priority Booking', 'inclusion', 999, 'Priority appointment scheduling');