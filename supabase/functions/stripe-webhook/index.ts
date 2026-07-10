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

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400, headers: corsHeaders });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event);
        break;

      case "charge.refund.updated":
        await handleRefundUpdated(event);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event);
        break;

      case "invoice.finalized":
        await handleInvoiceFinalized(event);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;

      default:
        // Unhandled event — acknowledge with 200
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook handler error: ${message}`, {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ─── checkout.session.completed ───
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (session.mode === "subscription") {
    // Subscription checkout — handled by subscription events
    return;
  }

  // Payment checkout (deposit or full)
  const bookingId = session.metadata?.booking_id;
  if (!bookingId) return;

  const paymentType = session.metadata?.payment_type ?? "deposit";
  const depositPence = parseInt(session.metadata?.deposit_pence ?? "0", 10);
  const totalPricePence = parseInt(session.metadata?.total_price_pence ?? "0", 10);

  // Record the payment
  await supabase.from("payments").insert({
    booking_id: bookingId,
    stripe_payment_intent_id: session.payment_intent as string,
    stripe_customer_id: session.customer as string,
    amount_pence: session.amount_total ?? totalPricePence,
    deposit_pence: paymentType === "deposit" ? depositPence : 0,
    currency: session.currency ?? "gbp",
    status: "succeeded",
    payment_method: "card",
    description: session.metadata?.payment_type === "deposit"
      ? `20% deposit for booking ${session.metadata?.booking_reference}`
      : `Full payment for booking ${session.metadata?.booking_reference}`,
    metadata: session.metadata,
  });

  // Update booking deposit status
  if (paymentType === "deposit") {
    await supabase
      .from("bookings")
      .update({ deposit_paid: true, deposit_amount_pence: depositPence })
      .eq("id", bookingId);
  } else {
    await supabase
      .from("bookings")
      .update({ deposit_paid: true, deposit_amount_pence: totalPricePence })
      .eq("id", bookingId);
  }

  // Notify customer
  const booking = await supabase
    .from("bookings")
    .select("user_id, reference")
    .eq("id", bookingId)
    .maybeSingle();

  if (booking.data?.user_id) {
    await supabase.from("notifications").insert({
      user_id: booking.data.user_id,
      booking_id: bookingId,
      type: "payment_received",
      title: "Payment Received",
      body: `Your ${paymentType === "deposit" ? "20% deposit" : "full payment"} of £${((session.amount_total ?? 0) / 100).toFixed(2)} has been received for booking ${booking.data.reference}.`,
      action_url: `/account/bookings/${bookingId}`,
    });
  }
}

// ─── payment_intent.succeeded ───
async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;

  // Check if we already recorded this payment (from checkout.session.completed)
  const existing = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_payment_intent_id", intent.id)
    .maybeSingle();

  if (existing.data) return; // Already recorded

  const bookingId = intent.metadata?.booking_id;
  if (!bookingId) return;

  await supabase.from("payments").insert({
    booking_id: bookingId,
    stripe_payment_intent_id: intent.id,
    stripe_charge_id: intent.latest_charge as string,
    amount_pence: intent.amount_received,
    currency: intent.currency,
    status: "succeeded",
    payment_method: "card",
    description: `Payment for booking ${intent.metadata?.booking_reference ?? bookingId}`,
    metadata: intent.metadata,
  });
}

// ─── payment_intent.payment_failed ───
async function handlePaymentFailed(event: Stripe.Event) {
  const intent = event.data.object as Stripe.PaymentIntent;

  const existing = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_payment_intent_id", intent.id)
    .maybeSingle();

  if (existing.data) {
    await supabase
      .from("payments")
      .update({
        status: "failed",
        failure_reason: intent.last_payment_error?.message ?? "Payment failed",
      })
      .eq("id", existing.data.id);
  } else {
    const bookingId = intent.metadata?.booking_id;
    if (!bookingId) return;

    await supabase.from("payments").insert({
      booking_id: bookingId,
      stripe_payment_intent_id: intent.id,
      amount_pence: intent.amount,
      currency: intent.currency,
      status: "failed",
      payment_method: "card",
      failure_reason: intent.last_payment_error?.message ?? "Payment failed",
      metadata: intent.metadata,
    });
  }
}

// ─── charge.refunded ───
async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;

  if (!charge.refunds?.data.length) return;

  const refund = charge.refunds.data[0];
  const payment = await supabase
    .from("payments")
    .select("id, refund_amount_pence, amount_pence")
    .eq("stripe_charge_id", charge.id)
    .maybeSingle();

  if (!payment.data) return;

  const totalRefunded = (payment.data.refund_amount_pence ?? 0) + refund.amount;

  const newStatus = totalRefunded >= payment.data.amount_pence
    ? "refunded"
    : "partially_refunded";

  await supabase
    .from("payments")
    .update({
      refund_amount_pence: totalRefunded,
      refunded_at: new Date().toISOString(),
      status: newStatus,
    })
    .eq("id", payment.data.id);

  // Notify customer
  const booking = await supabase
    .from("bookings")
    .select("user_id, reference")
    .eq("id", payment.data.booking_id ?? "")
    .maybeSingle();

  if (booking.data?.user_id) {
    await supabase.from("notifications").insert({
      user_id: booking.data.user_id,
      booking_id: payment.data.booking_id,
      type: "system",
      title: "Refund Processed",
      body: `A refund of £${(refund.amount / 100).toFixed(2)} has been processed for booking ${booking.data.reference}.`,
    });
  }
}

// ─── charge.refund.updated ───
async function handleRefundUpdated(event: Stripe.Event) {
  const refund = event.data.object as Stripe.Refund;

  const payment = await supabase
    .from("payments")
    .select("id")
    .eq("stripe_charge_id", refund.charge)
    .maybeSingle();

  if (!payment.data) return;

  if (refund.status === "failed") {
    await supabase
      .from("payments")
      .update({
        status: "succeeded",
        refund_amount_pence: 0,
        refunded_at: null,
      })
      .eq("id", payment.data.id);
  }
}

// ─── invoice.paid ───
async function handleInvoicePaid(event: Stripe.Event) {
  const stripeInvoice = event.data.object as Stripe.Invoice;

  if (!stripeInvoice.id) return;

  // Check if invoice already exists
  const existing = await supabase
    .from("invoices")
    .select("id")
    .eq("stripe_payment_intent_id", stripeInvoice.payment_intent as string)
    .maybeSingle();

  if (existing.data) {
    await supabase
      .from("invoices")
      .update({
        status: "paid",
        amount_paid_pence: stripeInvoice.amount_paid,
        amount_due_pence: stripeInvoice.amount_due,
        paid_at: new Date().toISOString(),
      })
      .eq("id", existing.data.id);
    return;
  }

  // For subscription invoices, create a record
  const subscriptionId = stripeInvoice.subscription as string;
  if (!subscriptionId) return;

  const sub = await supabase
    .from("subscriptions")
    .select("id, user_id, plan_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (!sub.data) return;

  await supabase.from("invoices").insert({
    booking_id: crypto.randomUUID(), // Subscriptions aren't tied to a specific booking
    payment_id: null,
    user_id: sub.data.user_id,
    invoice_number: stripeInvoice.number ?? undefined,
    invoice_date: new Date(stripeInvoice.created * 1000).toISOString().split("T")[0],
    subtotal_pence: stripeInvoice.subtotal,
    vat_rate: 0,
    vat_amount_pence: 0,
    total_pence: stripeInvoice.total,
    amount_paid_pence: stripeInvoice.amount_paid,
    amount_due_pence: stripeInvoice.amount_due,
    status: "paid",
    customer_name: stripeInvoice.customer_name ?? "",
    customer_email: stripeInvoice.customer_email ?? "",
    service_description: `Subscription: ${stripeInvoice.lines.data[0]?.description ?? "Cleaning plan"}`,
    line_items: stripeInvoice.lines.data.map((line) => ({
      label: line.description,
      quantity: line.quantity ?? 1,
      unit_price_pence: line.amount,
      total_pence: line.amount_total,
    })),
    pdf_url: stripeInvoice.invoice_pdf,
    paid_at: new Date().toISOString(),
  });

  // Notify customer
  await supabase.from("notifications").insert({
    user_id: sub.data.user_id,
    invoice_id: null,
    type: "invoice_ready",
    title: "Invoice Ready",
    body: `Your invoice for £${(stripeInvoice.total / 100).toFixed(2)} is now available.`,
    action_url: "/account/invoices",
  });
}

// ─── invoice.finalized ───
async function handleInvoiceFinalized(event: Stripe.Event) {
  const stripeInvoice = event.data.object as Stripe.Invoice;

  const subscriptionId = stripeInvoice.subscription as string;
  if (!subscriptionId) return;

  const sub = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (!sub.data) return;

  // Check if already exists
  const existing = await supabase
    .from("invoices")
    .select("id")
    .eq("invoice_number", stripeInvoice.number)
    .maybeSingle();

  if (existing.data) return;

  await supabase.from("invoices").insert({
    booking_id: crypto.randomUUID(),
    user_id: sub.data.user_id,
    invoice_number: stripeInvoice.number ?? undefined,
    invoice_date: new Date(stripeInvoice.created * 1000).toISOString().split("T")[0],
    subtotal_pence: stripeInvoice.subtotal,
    vat_rate: 0,
    vat_amount_pence: 0,
    total_pence: stripeInvoice.total,
    amount_paid_pence: 0,
    amount_due_pence: stripeInvoice.total,
    status: "sent",
    customer_name: stripeInvoice.customer_name ?? "",
    customer_email: stripeInvoice.customer_email ?? "",
    service_description: `Subscription: ${stripeInvoice.lines.data[0]?.description ?? "Cleaning plan"}`,
    line_items: stripeInvoice.lines.data.map((line) => ({
      label: line.description,
      quantity: line.quantity ?? 1,
      unit_price_pence: line.amount,
      total_pence: line.amount_total,
    })),
    pdf_url: stripeInvoice.invoice_pdf,
    sent_at: new Date().toISOString(),
  });
}

// ─── customer.subscription.created ───
async function handleSubscriptionCreated(event: Stripe.Event) {
  const sub = event.data.object as Stripe.Subscription;

  const planId = sub.metadata?.plan_id;
  if (!planId) return;

  // Look up user by email from Stripe customer
  const customer = await stripe.customers.retrieve(sub.customer as string);
  const email = (customer as Stripe.Customer).email;

  if (!email) return;

  // Find user in auth.users by email
  const { data: authUser } = await supabase
    .from("auth.users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  // Fallback: use metadata if available
  const userId = authUser?.id ?? sub.metadata?.user_id;
  if (!userId) return;

  // Insert subscription record
  await supabase.from("subscriptions").insert({
    user_id: userId,
    plan_id: planId,
    stripe_subscription_id: sub.id,
    stripe_customer_id: sub.customer as string,
    status: sub.status,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    cancel_at_period_end: sub.cancel_at_period_end,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    metadata: sub.metadata,
  });

  // Notify customer
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "system",
    title: "Subscription Activated",
    body: "Your cleaning subscription has been activated. Your first visit will be scheduled soon!",
  });
}

// ─── customer.subscription.updated ───
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const sub = event.data.object as Stripe.Subscription;

  await supabase
    .from("subscriptions")
    .update({
      status: sub.status,
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
      stripe_customer_id: sub.customer as string,
    })
    .eq("stripe_subscription_id", sub.id);
}

// ─── customer.subscription.deleted ───
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const sub = event.data.object as Stripe.Subscription;

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      cancel_at_period_end: false,
    })
    .eq("stripe_subscription_id", sub.id);
}
