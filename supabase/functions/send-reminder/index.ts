import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SERVICE_LABELS: Record<string, string> = {
  domestic: "Domestic Cleaning",
  deep: "Deep Cleaning",
  end_of_tenancy: "End of Tenancy Cleaning",
  office: "Office Cleaning",
};
const TIME_LABELS: Record<string, string> = {
  morning: "Morning (8am – 12pm)",
  afternoon: "Afternoon (12pm – 4pm)",
  evening: "Evening (4pm – 6pm)",
};

function formatPrice(pence: number) {
  return `£${(pence / 100).toFixed(2).replace(".00", "")}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .maybeSingle();

    if (error || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ success: true, note: "Resend not configured — email skipped" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const balanceDue = booking.total_price_pence - booking.deposit_amount_pence;

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#00AEEF;padding:28px 24px;border-radius:12px 12px 0 0;">
    <h1 style="color:white;margin:0 0 4px;font-size:22px;">Appointment Reminder</h1>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">Hi ${booking.first_name}, your clean is coming up!</p>
  </div>
  <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <div style="background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #e5e7eb;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;">Reference</p>
      <p style="margin:0 0 12px;font-size:22px;font-weight:900;color:#00AEEF;">${booking.reference}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:5px 0;color:#6b7280;width:120px;">Service</td><td style="padding:5px 0;font-weight:600;">${SERVICE_LABELS[booking.service_type] ?? booking.service_type}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;">Date</td><td style="padding:5px 0;font-weight:600;">${booking.preferred_date}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;">Time</td><td style="padding:5px 0;font-weight:600;">${TIME_LABELS[booking.preferred_time] ?? booking.preferred_time}</td></tr>
        <tr><td style="padding:5px 0;color:#6b7280;">Address</td><td style="padding:5px 0;">${booking.address}, ${booking.postcode}</td></tr>
        <tr style="border-top:1px solid #f3f4f6;"><td style="padding:10px 0 0;font-weight:bold;color:#374151;">Balance Due</td><td style="padding:10px 0 0;font-weight:900;color:#00AEEF;font-size:18px;">${formatPrice(balanceDue)}</td></tr>
      </table>
    </div>
    <p style="margin:0;font-size:13px;color:#6b7280;">The balance is due on the day of your clean. If you need to reschedule, please call us at least 24 hours before your appointment.</p>
  </div>
  <div style="padding:16px 24px;text-align:center;color:#9ca3af;font-size:12px;">
    <p style="margin:0;">Questions? <a href="tel:08000123456" style="color:#00AEEF;">0800 012 3456</a> · <a href="mailto:hello@puremaids.co.uk" style="color:#00AEEF;">hello@puremaids.co.uk</a></p>
    <p style="margin:6px 0 0;">PureMaids Ltd · London, United Kingdom</p>
  </div>
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PureMaids <notifications@puremaids.co.uk>",
        to: [booking.email],
        subject: `Reminder: Your clean is on ${booking.preferred_date} — ${booking.reference}`,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
