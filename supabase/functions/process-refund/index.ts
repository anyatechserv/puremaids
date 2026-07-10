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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: admin } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ─── Full refund ───
    if (body.mode === "full") {
      return await processFullRefund(body);
    }

    // ─── Partial refund ───
    return await processPartialRefund(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

async function processFullRefund(body: {
  paymentId: string;
  reason?: string;
}) {
  // Fetch the payment record
  const { data: payment, error: fetchErr } = await supabase
    .from("payments")
    .select("id, stripe_charge_id, stripe_payment_intent_id, amount_pence, refund_amount_pence")
    .eq("id", body.paymentId)
    .maybeSingle();

  if (fetchErr || !payment) {
    return new Response(
      JSON.stringify({ error: "Payment not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const refundableAmount = payment.amount_pence - (payment.refund_amount_pence ?? 0);
  if (refundableAmount <= 0) {
    return new Response(
      JSON.stringify({ error: "No refundable amount remaining" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Create Stripe refund
  const refund = await stripe.refunds.create({
    charge: payment.stripe_charge_id,
    amount: refundableAmount,
    reason: (body.reason as Stripe.RefundCreateParams.Reason) ?? "requested_by_customer",
    metadata: {
      payment_id: payment.id,
      admin_refund: "true",
    },
  });

  // Update payment record
  const totalRefunded = (payment.refund_amount_pence ?? 0) + refundableAmount;
  await supabase
    .from("payments")
    .update({
      refund_amount_pence: totalRefunded,
      refunded_at: new Date().toISOString(),
      status: "refunded",
    })
    .eq("id", payment.id);

  return new Response(
    JSON.stringify({
      refundId: refund.id,
      amountRefundedPence: refundableAmount,
      status: refund.status,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

async function processPartialRefund(body: {
  paymentId: string;
  amountPence: number;
  reason?: string;
}) {
  const { data: payment, error: fetchErr } = await supabase
    .from("payments")
    .select("id, stripe_charge_id, amount_pence, refund_amount_pence")
    .eq("id", body.paymentId)
    .maybeSingle();

  if (fetchErr || !payment) {
    return new Response(
      JSON.stringify({ error: "Payment not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const alreadyRefunded = payment.refund_amount_pence ?? 0;
  const refundableAmount = payment.amount_pence - alreadyRefunded;

  if (body.amountPence > refundableAmount) {
    return new Response(
      JSON.stringify({
        error: `Refund amount exceeds refundable balance. Maximum: ${refundableAmount}p`,
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const refund = await stripe.refunds.create({
    charge: payment.stripe_charge_id,
    amount: body.amountPence,
    reason: (body.reason as Stripe.RefundCreateParams.Reason) ?? "requested_by_customer",
    metadata: {
      payment_id: payment.id,
      admin_refund: "true",
    },
  });

  const totalRefunded = alreadyRefunded + body.amountPence;
  const newStatus = totalRefunded >= payment.amount_pence
    ? "refunded"
    : "partially_refunded";

  await supabase
    .from("payments")
    .update({
      refund_amount_pence: totalRefunded,
      refunded_at: new Date().toISOString(),
      status: newStatus,
    })
    .eq("id", payment.id);

  return new Response(
    JSON.stringify({
      refundId: refund.id,
      amountRefundedPence: body.amountPence,
      status: refund.status,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
