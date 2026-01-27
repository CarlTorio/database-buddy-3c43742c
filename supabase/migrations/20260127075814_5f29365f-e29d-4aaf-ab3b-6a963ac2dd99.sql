-- ===========================================================================
-- ADMIN SETTINGS TABLE
-- Stores admin configuration including password
-- ===========================================================================
CREATE TABLE public.admin_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for setting_key
CREATE INDEX idx_admin_settings_key ON public.admin_settings(setting_key);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only allow select for anon, full access for authenticated
CREATE POLICY "Allow select for anon on admin_settings" ON public.admin_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow all for authenticated on admin_settings" ON public.admin_settings
    FOR ALL USING (true) WITH CHECK (true);

-- Allow update for anon (so password can be changed from admin panel)
CREATE POLICY "Allow update for anon on admin_settings" ON public.admin_settings
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow insert for anon on admin_settings" ON public.admin_settings
    FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON public.admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default admin password
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
    ('admin_password', 'HILOME2026');