import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  contactNumber: string;
  membership: string;
  date: string;
  time: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, contactNumber, membership, date, time, message }: BookingEmailRequest = await req.json();

    console.log(`Sending booking confirmation to: ${email}`);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Hilomè Skin Clinic <onboarding@resend.dev>",
      to: [email],
      subject: "Your Consultation Booking is Confirmed! ✨",
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
            <div style="background-color: #8B7355; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">HILOMÈ</h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 12px; letter-spacing: 1px;">SKIN CLINIC</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #8B7355; margin: 0 0 20px; font-size: 24px; font-weight: 400;">Thank You, ${name}! 🌟</h2>
              
              <p style="color: #666666; line-height: 1.8; margin: 0 0 25px;">
                Your consultation has been successfully booked. We're excited to help you achieve your skincare goals!
              </p>
              
              <!-- Booking Details Card -->
              <div style="background-color: #f8f5f2; border-radius: 12px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #8B7355; margin: 0 0 20px; font-size: 18px; font-weight: 500;">📅 Booking Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Date</td>
                    <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Time</td>
                    <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Membership</td>
                    <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${membership}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px;">Contact</td>
                    <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right; font-weight: 500;">${contactNumber}</td>
                  </tr>
                  ${message ? `
                  <tr>
                    <td style="padding: 10px 0; color: #888888; font-size: 14px; vertical-align: top;">Message</td>
                    <td style="padding: 10px 0; color: #333333; font-size: 14px; text-align: right;">${message}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- What to Expect -->
              <div style="margin: 30px 0;">
                <h3 style="color: #8B7355; margin: 0 0 15px; font-size: 16px;">What to Expect:</h3>
                <ul style="color: #666666; line-height: 2; padding-left: 20px; margin: 0;">
                  <li>Our team will confirm your appointment within 24 hours</li>
                  <li>Please arrive 10 minutes before your scheduled time</li>
                  <li>Bring any relevant skincare products you currently use</li>
                </ul>
              </div>
              
              <!-- Contact Info -->
              <div style="background-color: #8B7355; border-radius: 12px; padding: 25px; margin-top: 30px; text-align: center;">
                <p style="color: #ffffff; margin: 0 0 10px; font-size: 14px;">Questions? Contact us:</p>
                <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 500;">📞 0977 334 4200</p>
                <p style="color: #ffffff; margin: 10px 0 0; font-size: 14px;">📧 cruzskin@gmail.com</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f5f2; padding: 25px 30px; text-align: center;">
              <p style="color: #888888; margin: 0; font-size: 12px;">
                © 2024 Hilomè Skin Clinic. All rights reserved.
              </p>
              <p style="color: #888888; margin: 10px 0 0; font-size: 12px;">
                6014 Mandaue City, Philippines
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);

    // Optionally send notification to clinic
    const clinicEmailResponse = await resend.emails.send({
      from: "Hilomè Booking System <onboarding@resend.dev>",
      to: ["cruzskin@gmail.com"],
      subject: `New Booking: ${name} - ${date} at ${time}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #8B7355; margin-top: 0;">📅 New Consultation Booking</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Name</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Email</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Phone</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${contactNumber}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Membership</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${membership}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Date</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; color: #666;">Time</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${time}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 12px; font-weight: bold; color: #666; vertical-align: top;">Message</td>
                <td style="padding: 12px;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Clinic notification sent successfully:", clinicEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      customerEmail: customerEmailResponse,
      clinicEmail: clinicEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
