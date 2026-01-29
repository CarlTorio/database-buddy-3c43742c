import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  contactNumber: string;
  membership?: string;
  date: string;
  time: string;
  message?: string;
}

// Format date to Philippine timezone
const formatDatePH = (dateString: string): { formatted: string; dayOfWeek: string } => {
  const date = new Date(dateString + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Manila'
  };
  const dayOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long',
    timeZone: 'Asia/Manila'
  };
  return {
    formatted: date.toLocaleDateString('en-PH', options),
    dayOfWeek: date.toLocaleDateString('en-PH', dayOptions)
  };
};

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, contactNumber, membership, date, time, message }: BookingEmailRequest = await req.json();

    console.log(`Sending booking confirmation to: ${email}`);
    
    const { formatted: formattedDate, dayOfWeek } = formatDatePH(date);
    const timestamp = getPhilippineTimestamp();

    // EMAIL #1: Customer Confirmation
    // NOTE: Using Resend test domain until hilomewellness.com is verified
    const customerEmailResponse = await resend.emails.send({
      from: "Hilomè Wellness Resort <onboarding@resend.dev>",
      to: [email],
      subject: "Booking Confirmed — Hilomè Wellness Resort",
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
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #8B7355; margin: 0 0 20px; font-size: 24px; font-weight: 400;">Hi ${name},</h2>
              
              <p style="color: #666666; line-height: 1.8; margin: 0 0 25px; font-size: 16px;">
                Your booking has been confirmed. Here are your details:
              </p>
              
              <!-- Booking Details Card -->
              <div style="background-color: #f8f5f2; border-radius: 16px; padding: 30px; margin: 25px 0; border-left: 4px solid #8B7355;">
                <h3 style="color: #8B7355; margin: 0 0 20px; font-size: 18px; font-weight: 600;">📅 Booking Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; color: #888888; font-size: 14px; font-weight: 500;">Date</td>
                    <td style="padding: 12px 0; color: #333333; font-size: 16px; text-align: right; font-weight: 600;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #888888; font-size: 14px; font-weight: 500;">Day</td>
                    <td style="padding: 12px 0; color: #333333; font-size: 16px; text-align: right; font-weight: 600;">${dayOfWeek}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #888888; font-size: 14px; font-weight: 500;">Time</td>
                    <td style="padding: 12px 0; color: #333333; font-size: 16px; text-align: right; font-weight: 600;">${time}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Important Note -->
              <div style="background-color: #FFF8E7; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #F5E6C8;">
                <p style="color: #8B6914; margin: 0; font-size: 15px; text-align: center;">
                  ⏰ <strong>Please arrive 10 minutes before your scheduled time.</strong>
                </p>
              </div>
              
              <!-- Closing -->
              <p style="color: #666666; line-height: 1.8; margin: 25px 0 0; font-size: 16px;">
                We look forward to seeing you! ✨
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
      text: `Hi ${name},\n\nYour booking has been confirmed.\n\nBooking Details:\n- Date: ${formattedDate}\n- Day: ${dayOfWeek}\n- Time: ${time}\n\nPlease arrive 10 minutes before your scheduled time.\n\nWe look forward to seeing you!\n\nHilomè Wellness Resort\n0977 334 4200\ncruzskin@gmail.com`,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);

    // EMAIL #2: Business Notification
    // NOTE: Using Resend test domain until hilomewellness.com is verified
    const businessEmailResponse = await resend.emails.send({
      from: "Hilomè Booking System <onboarding@resend.dev>",
      to: ["cruzskin@gmail.com"],
      subject: `New Booking Received — ${name}`,
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
            <div style="background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">📅 New Booking Alert</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 25px;">
              <h3 style="color: #333; margin: 0 0 20px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Customer Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px; width: 40%;">Name</td>
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
              </table>
              
              <h3 style="color: #333; margin: 25px 0 20px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Booking Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px; width: 40%;">Date</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Day</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${dayOfWeek}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Time</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px; font-weight: 600;">${time}</td>
                </tr>
                ${membership ? `
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px;">Membership</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${membership}</td>
                </tr>
                ` : ''}
                ${message ? `
                <tr>
                  <td style="padding: 10px 0; font-weight: 600; color: #666; font-size: 14px; vertical-align: top;">Message</td>
                  <td style="padding: 10px 0; color: #333; font-size: 14px;">${message}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f8f8; padding: 15px 25px; border-top: 1px solid #eee;">
              <p style="color: #999; margin: 0; font-size: 12px; text-align: center;">
                📍 Booking received on ${timestamp}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Booking Alert\n\nCustomer Details:\n- Name: ${name}\n- Contact: ${contactNumber}\n- Email: ${email}\n\nBooking Details:\n- Date: ${formattedDate}\n- Day: ${dayOfWeek}\n- Time: ${time}${membership ? `\n- Membership: ${membership}` : ''}${message ? `\n- Message: ${message}` : ''}\n\nBooking received on ${timestamp}`,
    });

    console.log("Business notification sent successfully:", businessEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      customerEmail: customerEmailResponse,
      businessEmail: businessEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-booking-confirmation function:", error);
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
