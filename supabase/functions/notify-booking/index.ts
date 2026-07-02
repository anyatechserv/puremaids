import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Resend API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { type, data } = body;

    let subject = "";
    let htmlContent = "";
    let toEmail = "hello@puremaids.co.uk";
    let customerEmail = data.email;

    if (type === "booking") {
      subject = `New Booking Request — ${data.first_name} ${data.last_name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #00AEEF; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Request</h1>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: bold; color: #1f2937;">${data.first_name} ${data.last_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; color: #1f2937;">${data.email}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; color: #1f2937;">${data.phone}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service</td><td style="padding: 8px 0; color: #1f2937;">${data.service_type}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Property</td><td style="padding: 8px 0; color: #1f2937;">${data.property_size || 'N/A'}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Frequency</td><td style="padding: 8px 0; color: #1f2937;">${data.frequency}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Address</td><td style="padding: 8px 0; color: #1f2937;">${data.address}, ${data.postcode}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Preferred Date</td><td style="padding: 8px 0; color: #1f2937;">${data.preferred_date} (${data.preferred_time})</td></tr>
              ${data.special_instructions ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Instructions</td><td style="padding: 8px 0; color: #1f2937;">${data.special_instructions}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `;
    } else if (type === "contact") {
      subject = `New Enquiry — ${data.first_name} ${data.last_name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #00AEEF; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Enquiry</h1>
          </div>
          <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb;">${data.message}</p>
          </div>
        </div>
      `;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PureMaids <notifications@puremaids.co.uk>",
        to: [toEmail],
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
