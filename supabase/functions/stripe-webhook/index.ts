import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.text();
    let event: Stripe.Event;

    if (STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) {
        return new Response("Missing stripe-signature", { status: 400, headers: corsHeaders });
      }
      event = await stripe.webhooks.constructEventAsync(body, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      // No webhook secret — parse raw (dev/test mode)
      event = JSON.parse(body) as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.booking_id;

      if (!bookingId) {
        return new Response("No booking_id in metadata", { status: 400, headers: corsHeaders });
      }

      // Mark deposit as paid
      const { data: booking, error } = await supabase
        .from("bookings")
        .update({
          deposit_paid: true,
          status: "confirmed",
        })
        .eq("id", bookingId)
        .select("id, reference, first_name, email")
        .maybeSingle();

      if (error) throw error;

      // Send confirmation emails (fire-and-forget via notify-booking)
      if (booking) {
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        fetch(`${SUPABASE_URL}/functions/v1/notify-booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({ bookingId: booking.id }),
        }).catch(() => {});
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
