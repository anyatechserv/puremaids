import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@15.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const SITE_URL = Deno.env.get("SITE_URL") ?? "https://puremaids.co.uk";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // ─── Subscription checkout ───
    if (body.mode === "subscription") {
      return await handleSubscriptionCheckout(body);
    }

    // ─── Booking deposit / full payment checkout ───
    return await handleBookingCheckout(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

// ─── Booking checkout (deposit or full payment) ───
async function handleBookingCheckout(body: {
  bookingId: string;
  bookingReference: string;
  serviceType: string;
  serviceLabel: string;
  totalPricePence: number;
  depositPence: number;
  extras: { name: string; pricePence: number }[];
  customerEmail: string;
  customerName: string;
  paymentType: "deposit" | "full";
}) {
  const amount = body.paymentType === "deposit" ? body.depositPence : body.totalPricePence;
  const description = body.paymentType === "deposit"
    ? `20% deposit for booking ${body.bookingReference}`
    : `Full payment for booking ${body.bookingReference}`;

  // Build line items for display
  const lineItems: Stripe.Checkout.SessionLineItemParams[] = [
    {
      quantity: 1,
      price_data: {
        currency: "gbp",
        unit_amount: amount,
        product_data: {
          name: body.serviceLabel,
          description,
        },
      },
    },
  ];

  // Add extras as separate line items for transparency
  if (body.paymentType === "full" && body.extras?.length > 0) {
    lineItems[0].price_data!.unit_amount = body.totalPricePence - body.extras.reduce((s, e) => s + e.pricePence, 0);
    for (const extra of body.extras) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: extra.pricePence,
          product_data: { name: extra.name },
        },
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    payment_method_options: {
      card: {
        setup_future_usage: "on_session",
      },
    },
    // Apple Pay & Google Pay are automatically available through Payment Request API
    // when using Checkout — no extra config needed
    line_items: lineItems,
    customer_email: body.customerEmail,
    metadata: {
      booking_id: body.bookingId,
      booking_reference: body.bookingReference,
      service_type: body.serviceType,
      payment_type: body.paymentType,
      total_price_pence: body.totalPricePence.toString(),
      deposit_pence: body.depositPence.toString(),
    },
    success_url: `${SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/booking/cancel?ref=${body.bookingReference}`,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  });

  // Update booking with Stripe session ID
  await supabase
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", body.bookingId);

  return new Response(
    JSON.stringify({ sessionId: session.id, url: session.url }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

// ─── Subscription checkout ───
async function handleSubscriptionCheckout(body: {
  planId: string;
  priceId: string;
  planName: string;
  customerEmail: string;
  customerName: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: body.priceId,
        quantity: 1,
      },
    ],
    customer_email: body.customerEmail,
    metadata: {
      plan_id: body.planId,
      plan_name: body.planName,
    },
    subscription_data: {
      metadata: {
        plan_id: body.planId,
        plan_name: body.planName,
        customer_name: body.customerName,
      },
    },
    success_url: `${SITE_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/subscriptions/cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });

  return new Response(
    JSON.stringify({ sessionId: session.id, url: session.url }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
