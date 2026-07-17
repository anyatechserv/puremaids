import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@15.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const SITE_URL = Deno.env.get("SITE_URL") || "https://puremaids.co.uk";

interface CheckoutRequest {
  bookingId?: string;
  bookingReference?: string;
  serviceType?: string;
  serviceLabel?: string;
  totalPricePence?: number;
  depositPence?: number;
  customerEmail?: string;
  customerName?: string;
  paymentType?: string;
  mode?: string;
  planId?: string;
  priceId?: string;
  planName?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function validatePrice(pence: number): boolean {
  return Number.isInteger(pence) && pence > 0 && pence <= 10000000;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: CheckoutRequest = await req.json();

    if (body.mode === "subscription") {
      if (!body.priceId || !body.planName || !body.customerEmail || !validateEmail(body.customerEmail)) {
        return new Response(JSON.stringify({ error: "Invalid subscription request" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: body.priceId, quantity: 1 }],
        customer_email: body.customerEmail,
        metadata: { plan_id: body.planId || "", plan_name: body.planName },
        success_url: `${SITE_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/subscriptions/cancel`,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      });

      return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // One-time payment
    if (!body.bookingId || !body.bookingReference || !body.serviceType || !body.customerEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!validateEmail(body.customerEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amountPence = body.paymentType === "deposit" ? body.depositPence : body.totalPricePence;
    if (!validatePrice(amountPence) || !validatePrice(body.totalPricePence!)) {
      return new Response(JSON.stringify({ error: "Invalid price" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "gbp",
          product_data: { name: body.serviceLabel || body.serviceType },
          unit_amount: amountPence,
        },
        quantity: 1,
      }],
      customer_email: body.customerEmail,
      metadata: {
        booking_id: body.bookingId,
        booking_reference: body.bookingReference,
        service_type: body.serviceType,
        payment_type: body.paymentType || "deposit",
        total_price_pence: String(body.totalPricePence),
        deposit_pence: String(body.depositPence || 0),
      },
      success_url: `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/book/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    });

    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", body.bookingId);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
