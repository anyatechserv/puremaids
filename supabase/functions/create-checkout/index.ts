import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

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
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const {
      bookingId,
      // Full booking payload (used when booking hasn't been saved yet)
      serviceType,
      propertySize,
      frequency,
      preferredDate,
      preferredTime,
      address,
      postcode,
      firstName,
      lastName,
      email,
      phone,
      specialInstructions,
      gdprConsent,
      basePricePence,
      extrasPricePence,
      totalPricePence,
      extras, // array of { name, price_pence }
      origin, // the site origin for redirect URLs
    } = body;

    let resolvedBookingId = bookingId;
    let reference = "";
    let depositPence = 0;

    if (!resolvedBookingId) {
      // Save booking first, then create checkout
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          service_type: serviceType,
          property_size: propertySize || null,
          frequency,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          address,
          postcode,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          special_instructions: specialInstructions || null,
          gdpr_consent: gdprConsent,
          base_price_pence: basePricePence,
          extras_price_pence: extrasPricePence,
          total_price_pence: totalPricePence,
          deposit_amount_pence: Math.round(totalPricePence * 0.25),
          status: "pending",
        })
        .select("id, reference, deposit_amount_pence")
        .single();

      if (bookingError || !booking) {
        throw new Error(bookingError?.message ?? "Failed to create booking");
      }

      resolvedBookingId = booking.id;
      reference = booking.reference;
      depositPence = booking.deposit_amount_pence;

      // Insert extras
      if (extras && extras.length > 0) {
        await supabase.from("booking_extras").insert(
          extras.map((e: { name: string; price_pence: number }) => ({
            booking_id: resolvedBookingId,
            name: e.name,
            price_pence: e.price_pence,
          })),
        );
      }
    } else {
      // Booking already exists — fetch deposit amount
      const { data: booking, error } = await supabase
        .from("bookings")
        .select("deposit_amount_pence, reference, email: email")
        .eq("id", resolvedBookingId)
        .maybeSingle();
      if (error || !booking) throw new Error("Booking not found");
      depositPence = booking.deposit_amount_pence;
      reference = booking.reference;
    }

    const siteOrigin = origin || "https://puremaids.co.uk";

    const SERVICE_LABELS: Record<string, string> = {
      domestic: "Domestic Cleaning",
      deep: "Deep Cleaning",
      end_of_tenancy: "End of Tenancy Cleaning",
      office: "Office Cleaning",
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${SERVICE_LABELS[serviceType] ?? serviceType} — 25% Deposit`,
              description: `Booking ${reference} · ${preferredDate} · ${address}, ${postcode}`,
              metadata: { booking_id: resolvedBookingId, reference },
            },
            unit_amount: depositPence,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        booking_id: resolvedBookingId,
        reference,
      },
      success_url: `${siteOrigin}/book-online/success?ref=${reference}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteOrigin}/book-online/cancel?ref=${reference}`,
    });

    // Store the Stripe session ID on the booking
    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", resolvedBookingId);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id, bookingId: resolvedBookingId, reference }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
