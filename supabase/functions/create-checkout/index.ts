import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@15.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20", typescript: true });
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://puremaids.co.uk";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const body = await req.json();
    if (body.mode === "subscription") return await handleSubscription(body);
    return await handleBooking(body);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

async function handleBooking(body: {
  bookingId: string; bookingReference: string; serviceType: string; serviceLabel: string;
  totalPricePence: number; depositPence: number; customerEmail: string; customerName: string;
  paymentType: "deposit" | "full";
}) {
  const amount = body.paymentType === "deposit" ? body.depositPence : body.totalPricePence;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: amount, product_data: { name: body.serviceLabel, description: body.paymentType === "deposit" ? `20% deposit for booking ${body.bookingReference}` : `Full payment for booking ${body.bookingReference}` } } }],
    customer_email: body.customerEmail,
    metadata: { booking_id: body.bookingId, booking_reference: body.bookingReference, service_type: body.serviceType, payment_type: body.paymentType, total_price_pence: body.totalPricePence.toString(), deposit_pence: body.depositPence.toString() },
    success_url: `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}&ref=${body.bookingReference}`,
    cancel_url: `${SITE_URL}/book/cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });
  await supabase.from("bookings").update({ stripe_session_id: session.id }).eq("id", body.bookingId);
  return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function handleSubscription(body: {
  planId: string; priceId: string; planName: string; customerEmail: string; customerName: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: body.priceId, quantity: 1 }],
    customer_email: body.customerEmail,
    metadata: { plan_id: body.planId, plan_name: body.planName },
    subscription_data: { metadata: { plan_id: body.planId, plan_name: body.planName, customer_name: body.customerName } },
    success_url: `${SITE_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/subscriptions/cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });
  return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
