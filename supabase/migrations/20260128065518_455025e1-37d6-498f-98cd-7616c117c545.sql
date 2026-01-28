
-- Drop and recreate the sync function to always create patient records per member
CREATE OR REPLACE FUNCTION public.sync_member_to_patient()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- When member status becomes 'active', ensure they have a patient record
  IF NEW.status = 'active' AND (OLD IS NULL OR OLD.status != 'active') THEN
    -- Check if this specific member already has a patient record linked
    IF NOT EXISTS (SELECT 1 FROM public.patient_records WHERE member_id = NEW.id) THEN
      -- Insert a new patient record for this member
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
      -- Update existing patient record for this member
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
  
  -- Also sync updates to existing active members
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
$function$;
