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

const supabaseAnon = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface RefundRequest {
  paymentId?: string;
  amountPence?: number;
  reason?: string;
  mode?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("admin_profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!adminProfile) {
      return new Response(JSON.stringify({ error: "Forbidden: admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: RefundRequest = await req.json();

    if (!body.paymentId || !body.amountPence || !body.reason) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Number.isInteger(body.amountPence) || body.amountPence <= 0 || body.amountPence > 10000000) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validReasons = ["requested_by_customer", "duplicate", "fraudulent", "service_not_provided", "other"];
    if (!validReasons.includes(body.reason)) {
      return new Response(JSON.stringify({ error: "Invalid reason" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: payment, error: payError } = await supabaseAdmin
      .from("payments")
      .select("id, stripe_charge_id, stripe_payment_intent_id, amount_pence, refund_amount_pence, status")
      .eq("id", body.paymentId)
      .single();

    if (payError || !payment) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payment.status !== "succeeded" && payment.status !== "partially_refunded") {
      return new Response(JSON.stringify({ error: "Payment not eligible for refund" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const alreadyRefunded = payment.refund_amount_pence || 0;
    const maxRefundable = payment.amount_pence - alreadyRefunded;
    if (body.amountPence > maxRefundable) {
      return new Response(JSON.stringify({ error: "Refund amount exceeds refundable balance" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
      amount: body.amountPence,
      reason: body.reason as Stripe.RefundCreateParams.Reason,
      metadata: {
        admin_user_id: user.id,
        admin_role: adminProfile.role,
        payment_id: body.paymentId,
      },
    });

    const newTotalRefund = alreadyRefunded + body.amountPence;
    const newStatus = newTotalRefund >= payment.amount_pence ? "refunded" : "partially_refunded";

    await supabaseAdmin
      .from("payments")
      .update({
        refund_amount_pence: newTotalRefund,
        refunded_at: new Date().toISOString(),
        status: newStatus,
      })
      .eq("id", body.paymentId);

    return new Response(JSON.stringify({
      refundId: refund.id,
      amountRefundedPence: body.amountPence,
      status: refund.status,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Refund error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
