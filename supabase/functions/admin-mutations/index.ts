import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.93.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type AdminMutationsRequest =
  | {
      action: "update_booking_status";
      bookingId: string;
      status: "pending" | "completed" | "cancelled" | "no-show";
    }
  | {
      action: "confirm_member";
      memberId: string;
    }
  | {
      action: "append_medical_record";
      patientId: string;
      record: { id: string; date: string; notes: string };
    }
  | {
      action: "clear_all_data";
    };

const generateReferralCode = (name: string): string => {
  // Remove spaces and non-alpha characters, take first 6, uppercase
  const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const baseCode = cleanName.substring(0, 6).padEnd(6, "X");
  return baseCode;
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const body = (await req.json()) as AdminMutationsRequest;

    if (body.action === "update_booking_status") {
      const { data, error } = await admin
        .from("bookings")
        .update({ status: body.status })
        .eq("id", body.bookingId)
        .select("id,status,updated_at")
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "Booking not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ booking: data }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (body.action === "confirm_member") {
      const { data: member, error: memberError } = await admin
        .from("members")
        .select("id,name,referred_by")
        .eq("id", body.memberId)
        .maybeSingle();

      if (memberError) throw memberError;
      if (!member) {
        return new Response(JSON.stringify({ error: "Member not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const now = new Date();
      const expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);

      const referralCode = generateReferralCode(member.name || "MEM");

      const { data: updated, error: updateError } = await admin
        .from("members")
        .update({
          status: "active",
          membership_start_date: now.toISOString(),
          membership_expiry_date: expiry.toISOString(),
          referral_code: referralCode,
        })
        .eq("id", body.memberId)
        .select("id,status,referral_code")
        .maybeSingle();

      if (updateError) throw updateError;
      if (!updated) {
        return new Response(JSON.stringify({ error: "Failed to update member" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // If member was referred, increment the referrer's referral_count
      if (member.referred_by) {
        const referredBy = String(member.referred_by).toUpperCase().trim();
        const { data: referrer, error: referrerError } = await admin
          .from("members")
          .select("id,referral_count")
          .eq("referral_code", referredBy)
          .eq("status", "active")
          .maybeSingle();

        if (!referrerError && referrer) {
          await admin
            .from("members")
            .update({ referral_count: (referrer.referral_count || 0) + 1 })
            .eq("id", referrer.id);
        }
      }

      return new Response(JSON.stringify({ member: updated }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (body.action === "append_medical_record") {
      const { data: patient, error: patientError } = await admin
        .from("patient_records")
        .select("id,medical_records")
        .eq("id", body.patientId)
        .maybeSingle();

      if (patientError) throw patientError;
      if (!patient) {
        return new Response(JSON.stringify({ error: "Patient not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const existing = Array.isArray(patient.medical_records) ? patient.medical_records : [];
      const updatedMedicalRecords = [...existing, body.record];

      const { data: updatedPatient, error: updateError } = await admin
        .from("patient_records")
        .update({
          medical_records: updatedMedicalRecords,
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.patientId)
        .select("id,medical_records,updated_at")
        .maybeSingle();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ patient: updatedPatient }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (body.action === "clear_all_data") {
      const { error: aptError } = await admin.from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (aptError) throw aptError;

      const { error: inqError } = await admin.from("membership_inquiries").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (inqError) throw inqError;

      return new Response(JSON.stringify({ success: true, message: "All data cleared" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in admin-mutations:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
