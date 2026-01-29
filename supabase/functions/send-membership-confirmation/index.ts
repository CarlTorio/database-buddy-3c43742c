import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface MembershipEmailRequest {
  name: string;
  email: string;
  contactNumber: string;
  membershipTier: string;
  referralCode: string;
  amountPaid?: number;
}

// Get current timestamp in Philippine timezone
const getPhilippineTimestamp = (): string => {
  return new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Get tier color based on membership type
const getTierColor = (tier: string): string => {
  const tierLower = tier.toLowerCase();
  if (tierLower.includes('platinum')) return '#94A3B8';
  if (tierLower.includes('gold')) return '#EAB308';
  return '#22C55E'; // Green
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, contactNumber, membershipTier, referralCode, amountPaid }: MembershipEmailRequest = await req.json();

    console.log(`Sending membership confirmation to: ${email}`);
    
    const timestamp = getPhilippineTimestamp();
    const tierColor = getTierColor(membershipTier);

    // EMAIL #3: Member Welcome Email
    // NOTE: Using Resend test domain until hilomewellness.com is verified
    const memberEmailResponse = await resend.emails.send({
      from: "Hilomè Wellness Resort <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Hilomè Wellness Resort — Membership Confirmed",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f5f2;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 3px;">HILOMÈ</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Wellness Resort</p>
            </div>
            
            <!-- Celebration Banner -->
            <div style="background: linear-gradient(135deg, ${tierColor}15 0%, ${tierColor}05 100%); padding: 30px; text-align: center; border-bottom: 3px solid ${tierColor};">
              <p style="font-size: 40px; margin: 0 0 10px;">🎉</p>
              <h2 style="color: #333; margin: 0; font-size: 22px; font-weight: 600;">Congratulations!</h2>
              <p style="color: #666; margin: 10px 0 0; font-size: 15px;">Your membership registration is successful.</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #8B7355; margin: 0 0 20px; font-size: 22px; font-weight: 400;">Hi ${name},</h2>
              
              <!-- Membership Details Card -->
              <div style="background-color: #f8f5f2; border-radius: 16px; padding: 30px; margin: 25px 0; border-left: 4px solid ${tierColor};">
                <h3 style="color: #8B7355; margin: 0 0 20px; font-size: 18px; font-weight: 600;">💎 Membership Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #888888; font-size: 14px; font-weight: 500;">Membership Tier</td>
                    <td style="padding: 12px 0; color: ${tierColor}; font-size: 18px; text-align: right; font-weight: 700;">${membershipTier}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Referral Code Card -->
              <div style="background: linear-gradient(135deg, #FFF8E7 0%, #FEF3C7 100%); border-radius: 16px; padding: 30px; margin: 25px 0; text-align: center; border: 2px dashed #EAB308;">
                <p style="color: #8B6914; margin: 0 0 10px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">🎁 Your Referral Code</p>
                <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin: 15px 0; border: 2px solid #EAB308;">
                  <p style="color: #333; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${referralCode}</p>
                </div>
                <p style="color: #8B6914; margin: 15px 0 0; font-size: 14px; line-height: 1.6;">
                  Share this code with friends and family!<br>
                  <strong>Earn FREE services and inclusions</strong> as referral rewards.
                </p>
              </div>
              
              <!-- Closing -->
              <p style="color: #666666; line-height: 1.8; margin: 25px 0 0; font-size: 16px;">
                Thank you for joining the Hilomè family. We're excited to have you! 🌟
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f5f2; padding: 30px; text-align: center; border-top: 1px solid #e8e0d8;">
              <p style="color: #8B7355; margin: 0 0 10px; font-size: 14px; font-weight: 600;">Hilomè Wellness Resort</p>
              <p style="color: #888888; margin: 0 0 5px; font-size: 13px;">📞 0977 334 4200</p>
              <p style="color: #888888; margin: 0 0 5px; font-size: 13px;">📧 cruzskin@gmail.com</p>
              <p style="color: #888888; margin: 0 0 15px; font-size: 13px;">📍 Mandaue City, Cebu, Philippines</p>
              <div style="margin-top: 15px;">
                <a href="https://facebook.com/hilome" style="color: #8B7355; text-decoration: none; margin: 0 10px; font-size: 13px;">Facebook</a>
                <span style="color: #ccc;">|</span>
                <a href="https://instagram.com/hilome" style="color: #8B7355; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
              </div>
              <p style="color: #aaaaaa; margin: 20px 0 0; font-size: 11px;">
                © ${new Date().getFullYear()} Hilomè Wellness Resort. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi ${name},\n\nCongratulations! Your membership registration is successful.\n\nMembership Details:\n- Membership Tier: ${membershipTier}\n- Referral Code: ${referralCode}\n\nShare your referral code with friends and earn FREE services and inclusions as rewards!\n\nThank you for joining the Hilomè family. We're excited to have you!\n\nHilomè Wellness Resort\n0977 334 4200\ncruzskin@gmail.com`,
    });

    console.log("Member welcome email sent successfully:", memberEmailResponse);

    // EMAIL #4: Business Notification
    // NOTE: Using Resend test domain until hilomewellness.com is verified
    const businessEmailResponse = await resend.emails.send({
      from: "Hilomè Membership System <onboarding@resend.dev>",
      to: ["cruzskin@gmail.com"],
      subject: `New Member Registered — ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
          <div style="max-width: 500px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, ${tierColor} 0%, ${tierColor}CC 100%); padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">👤 New Membership Alert</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 25px;">
              <h3 style="color: #333; margin: 0 0 20px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Member Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px; width: 45%;">Name</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Contact Number</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${contactNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Email</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Membership Tier</td>
                  <td style="padding: 10px 0; color: ${tierColor}; font-size: 14px; font-weight: 700;">${membershipTier}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Referral Code Assigned</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px; font-family: 'Courier New', monospace; font-weight: 600;">${referralCode}</td>
                </tr>
                ${amountPaid ? `
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Amount Paid</td>
                  <td style="padding: 10px 0; color: #22C55E; font-size: 14px; font-weight: 600;">₱${amountPaid.toLocaleString()}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f8f8; padding: 15px 25px; border-top: 1px solid #eee;">
              <p style="color: #999; margin: 0; font-size: 12px; text-align: center;">
                📍 Registration received on ${timestamp}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Membership Alert\n\nMember Details:\n- Name: ${name}\n- Contact: ${contactNumber}\n- Email: ${email}\n- Membership Tier: ${membershipTier}\n- Referral Code: ${referralCode}${amountPaid ? `\n- Amount Paid: ₱${amountPaid.toLocaleString()}` : ''}\n\nRegistration received on ${timestamp}`,
    });

    console.log("Business notification sent successfully:", businessEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      memberEmail: memberEmailResponse,
      businessEmail: businessEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-membership-confirmation function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
