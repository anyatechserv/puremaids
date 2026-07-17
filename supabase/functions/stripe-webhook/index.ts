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

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Webhook signature verification failed:", msg);
    return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${msg}` }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
          const isDeposit = session.metadata?.payment_type === "deposit";
          const amountPence = session.amount_total || 0;
          const depositPence = parseInt(session.metadata?.deposit_pence || "0", 10);
          const totalPricePence = parseInt(session.metadata?.total_price_pence || "0", 10);

          await supabase
            .from("bookings")
            .update({
              status: "confirmed",
              deposit_paid: true,
              deposit_amount_pence: isDeposit ? depositPence : totalPricePence,
            })
            .eq("id", bookingId);

          await supabase.from("payments").insert({
            booking_id: bookingId,
            user_id: session.metadata?.user_id || null,
            stripe_payment_intent_id: session.payment_intent as string,
            stripe_customer_id: session.customer as string,
            amount_pence: amountPence,
            deposit_pence: isDeposit ? depositPence : totalPricePence,
            currency: session.currency || "gbp",
            status: "succeeded",
            payment_method: "card",
            description: session.metadata?.service_type || "Cleaning service",
            metadata: session.metadata || {},
          });
        }

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const planId = session.metadata?.plan_id;

          let planUuid: string | null = null;
          if (planId) {
            const { data: plan } = await supabase
              .from("subscription_plans")
              .select("id")
              .eq("slug", planId)
              .single();
            if (plan) planUuid = plan.id;
          }

          const { data: { user } } = await supabase.auth.admin.getUserBySession(session as any).catch(() => ({ data: { user: null } }));
          const customerEmail = session.customer_email || session.customer_details?.email || "";

          if (customerEmail && planUuid) {
            const { data: existingUser } = await supabase
              .from("customer_profiles")
              .select("user_id")
              .ilike("email", customerEmail)
              .limit(1);

            const userId = existingUser?.[0]?.user_id || null;

            await supabase.from("subscriptions").insert({
              user_id: userId,
              plan_id: planUuid,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const bookingId = intent.metadata?.booking_id;
        if (bookingId) {
          await supabase
            .from("payments")
            .update({ status: "failed", failure_reason: intent.last_payment_error?.message || "Payment failed" })
            .eq("stripe_payment_intent_id", intent.id);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("subscriptions")
          .update({ status: "canceled", canceled_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const refundAmount = charge.amount_refunded;
        const status = charge.amount_refunded >= charge.amount_captured ? "refunded" : "partially_refunded";
        await supabase
          .from("payments")
          .update({
            refund_amount_pence: refundAmount,
            refunded_at: new Date().toISOString(),
            status,
          })
          .eq("stripe_charge_id", charge.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook handler error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
