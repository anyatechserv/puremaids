import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const FROM_EMAIL = "PureMaids <noreply@puremaids.co.uk>";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { bookingId, type } = await req.json();

    if (!bookingId || !type) {
      return new Response(JSON.stringify({ error: "Missing bookingId or type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, reference, first_name, email, service_type, preferred_date, preferred_time, total_price_pence, deposit_amount_pence")
      .eq("id", bookingId)
      .single();

    if (!booking || !booking.email) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subjects: Record<string, string> = {
      confirmed: "Your PureMaids Booking is Confirmed",
      completed: "Your Cleaning is Complete - Please Review",
      cancelled: "Your PureMaids Booking has been Cancelled",
    };

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: booking.email,
      subject: subjects[type] || "PureMaids Update",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">${subjects[type] || "PureMaids Update"}</h1>
          <p>Hi ${booking.first_name},</p>
          <p>Your booking reference is <strong>${booking.reference || 'N/A'}</strong>.</p>
          <p>Service: ${booking.service_type}</p>
          <p>Date: ${booking.preferred_date} at ${booking.preferred_time}</p>
          <p>Total: £${(booking.total_price_pence / 100).toFixed(2)}</p>
          <p>Thank you for choosing PureMaids.</p>
        </div>
      `,
    });

    if (error) {
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Notify error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
