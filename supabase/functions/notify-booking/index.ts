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

function formatPrice(pence: number): string {
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

    // Support both old contact/booking data format and new bookingId format
    const body = await req.json();

    // Legacy format: { type, data }
    if (body.type === "contact" && body.data) {
      if (!RESEND_API_KEY) {
        return new Response(JSON.stringify({ error: "Resend not configured" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const d = body.data;
      await sendEmail(RESEND_API_KEY, {
        to: "hello@puremaids.co.uk",
        subject: `New Enquiry — ${d.first_name} ${d.last_name}`,
        html: contactHtml(d),
      });
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // New format: { bookingId }
    const { bookingId } = body;
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, booking_extras(*)")
      .eq("id", bookingId)
      .maybeSingle();

    if (error || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      // No Resend — just return success (email silently skipped)
      return new Response(JSON.stringify({ success: true, note: "Resend not configured — email skipped" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send admin notification
    await sendEmail(RESEND_API_KEY, {
      to: "hello@puremaids.co.uk",
      subject: `New Booking #${booking.reference} — ${booking.first_name} ${booking.last_name}`,
      html: adminBookingHtml(booking),
    });

    // Send customer confirmation
    await sendEmail(RESEND_API_KEY, {
      to: booking.email,
      subject: `Booking Confirmed — ${booking.reference} | PureMaids`,
      html: customerConfirmationHtml(booking),
    });

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

async function sendEmail(apiKey: string, opts: { to: string; subject: string; html: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "PureMaids <notifications@puremaids.co.uk>",
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adminBookingHtml(b: any): string {
  const extras = (b.booking_extras ?? [])
    .map((e: { name: string; price_pence: number }) => `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">${e.name}</td><td style="padding:6px 0;color:#1f2937;">+${formatPrice(e.price_pence)}</td></tr>`)
    .join("");

  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#00AEEF;padding:24px;border-radius:12px 12px 0 0;">
    <h1 style="color:white;margin:0;font-size:22px;">New Booking — ${b.reference}</h1>
    <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">PureMaids Admin Notification</p>
  </div>
  <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <h3 style="color:#374151;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em;">Customer</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:130px;">Name</td><td style="padding:6px 0;font-weight:bold;color:#1f2937;">${b.first_name} ${b.last_name}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:6px 0;color:#1f2937;">${b.email}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Phone</td><td style="padding:6px 0;color:#1f2937;">${b.phone}</td></tr>
    </table>
    <h3 style="color:#374151;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em;">Service</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:130px;">Service</td><td style="padding:6px 0;color:#1f2937;">${SERVICE_LABELS[b.service_type] ?? b.service_type}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Property Size</td><td style="padding:6px 0;color:#1f2937;">${b.property_size ?? "N/A"}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Frequency</td><td style="padding:6px 0;color:#1f2937;">${b.frequency}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Date</td><td style="padding:6px 0;color:#1f2937;">${b.preferred_date} — ${TIME_LABELS[b.preferred_time] ?? b.preferred_time}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;">Address</td><td style="padding:6px 0;color:#1f2937;">${b.address}, ${b.postcode}</td></tr>
      ${b.special_instructions ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;vertical-align:top;">Notes</td><td style="padding:6px 0;color:#1f2937;">${b.special_instructions}</td></tr>` : ""}
    </table>
    <h3 style="color:#374151;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:.05em;">Pricing</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:130px;">Base price</td><td style="padding:6px 0;color:#1f2937;">${formatPrice(b.base_price_pence)}</td></tr>
      ${extras}
      <tr style="border-top:1px solid #e5e7eb;"><td style="padding:10px 0 0;font-weight:bold;color:#111827;">Total</td><td style="padding:10px 0 0;font-weight:bold;color:#00AEEF;font-size:18px;">${formatPrice(b.total_price_pence)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Deposit due</td><td style="padding:4px 0;color:#1f2937;">${formatPrice(b.deposit_amount_pence)} (25%)</td></tr>
    </table>
  </div>
</div>`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function customerConfirmationHtml(b: any): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
  <div style="background:#00AEEF;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
    <h1 style="color:white;margin:0 0 4px;font-size:26px;">Booking Confirmed!</h1>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:15px;">Thank you, ${b.first_name}. We&apos;re looking forward to cleaning for you.</p>
  </div>
  <div style="padding:32px 24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;">
    <div style="background:white;border-radius:12px;padding:20px;margin-bottom:20px;border:2px solid #00AEEF;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;">Your Booking Reference</p>
      <p style="margin:0;font-size:32px;font-weight:900;color:#00AEEF;letter-spacing:.05em;">${b.reference}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Please keep this for your records</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:white;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr style="background:#f3f4f6;"><td colspan="2" style="padding:12px 16px;font-weight:bold;color:#374151;font-size:13px;">Booking Details</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;border-top:1px solid #f3f4f6;width:140px;">Service</td><td style="padding:10px 16px;color:#1f2937;font-size:14px;border-top:1px solid #f3f4f6;">${SERVICE_LABELS[b.service_type] ?? b.service_type}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;border-top:1px solid #f3f4f6;">Date</td><td style="padding:10px 16px;color:#1f2937;font-size:14px;border-top:1px solid #f3f4f6;">${b.preferred_date}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;border-top:1px solid #f3f4f6;">Time</td><td style="padding:10px 16px;color:#1f2937;font-size:14px;border-top:1px solid #f3f4f6;">${TIME_LABELS[b.preferred_time] ?? b.preferred_time}</td></tr>
      <tr><td style="padding:10px 16px;color:#6b7280;font-size:14px;border-top:1px solid #f3f4f6;">Address</td><td style="padding:10px 16px;color:#1f2937;font-size:14px;border-top:1px solid #f3f4f6;">${b.address}, ${b.postcode}</td></tr>
      <tr style="background:#f0fdf4;"><td style="padding:12px 16px;font-weight:bold;color:#374151;font-size:14px;border-top:1px solid #e5e7eb;">Total</td><td style="padding:12px 16px;font-weight:bold;color:#00AEEF;font-size:18px;border-top:1px solid #e5e7eb;">${formatPrice(b.total_price_pence)}</td></tr>
    </table>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-top:20px;">
      <p style="margin:0 0 8px;font-weight:bold;color:#92400e;font-size:14px;">What happens next?</p>
      <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">Our team will call you within <strong>2 hours</strong> to confirm your cleaner and collect your deposit (${formatPrice(b.deposit_amount_pence)}).</p>
    </div>
  </div>
  <div style="padding:20px 24px;text-align:center;color:#9ca3af;font-size:12px;">
    <p style="margin:0;">Questions? Call us on <a href="tel:08000123456" style="color:#00AEEF;">0800 012 3456</a> or email <a href="mailto:hello@puremaids.co.uk" style="color:#00AEEF;">hello@puremaids.co.uk</a></p>
    <p style="margin:8px 0 0;">PureMaids Ltd · London, United Kingdom</p>
  </div>
</div>`;
}

function contactHtml(d: Record<string, string>): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#00AEEF;padding:20px;border-radius:12px 12px 0 0;">
    <h1 style="color:white;margin:0;font-size:22px;">New Contact Enquiry</h1>
  </div>
  <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <p><strong>Name:</strong> ${d.first_name} ${d.last_name}</p>
    <p><strong>Email:</strong> ${d.email}</p>
    <p><strong>Phone:</strong> ${d.phone}</p>
    <p><strong>Service:</strong> ${d.service}</p>
    <p><strong>Message:</strong></p>
    <p style="background:white;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">${d.message}</p>
  </div>
</div>`;
}
