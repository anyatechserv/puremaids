/*
# Create subscription tables for recurring cleaning plans

## Summary
Adds two new tables to support Stripe-based subscription cleaning plans:
- `subscription_plans` — catalog of available recurring cleaning plans
- `subscriptions` — customer subscription records linked to Stripe

## New Table: subscription_plans
Stores the plan catalog (seeded with 3 plans: weekly, fortnightly, monthly).
- `id` — UUID primary key
- `slug` — unique URL-friendly identifier (e.g. 'weekly', 'fortnightly')
- `name` — display name
- `description` — short description
- `stripe_price_id` — Stripe Price ID for recurring billing
- `monthly_price_pence` — monthly cost in pence
- `visits_per_month` — number of cleaning visits per month
- `hours_per_visit` — duration of each visit
- `features` — JSONB array of feature bullet points
- `is_active` — soft disable
- `sort_order` — display order
- `created_at` / `updated_at` — audit timestamps

## New Table: subscriptions
Tracks each customer's subscription lifecycle.
- `id` — UUID primary key
- `user_id` — FK to auth.users (CASCADE)
- `plan_id` — FK to subscription_plans (CASCADE)
- `stripe_subscription_id` — Stripe Subscription ID (unique)
- `stripe_customer_id` — Stripe Customer ID
- `status` — enum: active | trialing | past_due | canceled | paused | incomplete
- `current_period_start` — Stripe billing period start
- `current_period_end` — Stripe billing period end
- `cancel_at_period_end` — whether subscription will cancel at period end
- `canceled_at` — cancellation timestamp
- `trial_end` — trial period end
- `metadata` — JSONB for arbitrary Stripe metadata
- `created_at` / `updated_at` — audit timestamps

## Security
- `subscription_plans`: public read (anon + authenticated), admin write
- `subscriptions`: customer reads own, admin reads all, no direct customer insert
  (subscriptions are created by the webhook when Stripe confirms)

## Indexes
- `subscription_plans(slug)` unique, `subscription_plans(is_active)`
- `subscriptions(user_id)`, `subscriptions(stripe_subscription_id)` unique,
  `subscriptions(status)`, `subscriptions(plan_id)`
*/

-- ============================================================
-- subscription_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                text        NOT NULL UNIQUE,
  name                text        NOT NULL,
  description         text,
  stripe_price_id     text        NOT NULL,
  monthly_price_pence integer     NOT NULL,
  visits_per_month    smallint    NOT NULL DEFAULT 1,
  hours_per_visit     smallint    NOT NULL DEFAULT 2,
  features            jsonb       NOT NULL DEFAULT '[]',
  is_active           boolean     NOT NULL DEFAULT true,
  sort_order          integer     NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_subscription_plans_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscription_plans_active
  ON subscription_plans(is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort
  ON subscription_plans(sort_order);

ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_plans" ON subscription_plans;
CREATE POLICY "public_select_plans" ON subscription_plans
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_select_plans" ON subscription_plans;
CREATE POLICY "admin_select_plans" ON subscription_plans
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_plans" ON subscription_plans;
CREATE POLICY "admin_insert_plans" ON subscription_plans
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_plans" ON subscription_plans;
CREATE POLICY "admin_update_plans" ON subscription_plans
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

-- ============================================================
-- subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid        NOT NULL
                              REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id                   uuid        NOT NULL
                              REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  stripe_subscription_id    text        UNIQUE,
  stripe_customer_id        text,
  status                    text        NOT NULL DEFAULT 'incomplete'
                              CHECK (status IN (
                                'active','trialing','past_due',
                                'canceled','paused','incomplete'
                              )),
  current_period_start      timestamptz,
  current_period_end        timestamptz,
  cancel_at_period_end      boolean     NOT NULL DEFAULT false,
  canceled_at               timestamptz,
  trial_end                 timestamptz,
  metadata                  jsonb       DEFAULT '{}',
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at();

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id
  ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id
  ON subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id
  ON subscriptions(plan_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_select_own_subscriptions" ON subscriptions;
CREATE POLICY "customers_select_own_subscriptions" ON subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_select_subscriptions" ON subscriptions;
CREATE POLICY "admin_select_subscriptions" ON subscriptions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_insert_subscriptions" ON subscriptions;
CREATE POLICY "admin_insert_subscriptions" ON subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "admin_update_subscriptions" ON subscriptions;
CREATE POLICY "admin_update_subscriptions" ON subscriptions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_profiles WHERE admin_profiles.user_id = auth.uid()
  ));

-- ============================================================
-- Seed: 3 subscription plans
-- ============================================================
INSERT INTO subscription_plans (slug, name, description, stripe_price_id, monthly_price_pence, visits_per_month, hours_per_visit, features, is_active, sort_order)
VALUES
  ('weekly', 'Weekly Clean', 'One visit every week — ideal for busy households.', 'price_weekly_puremaids', 19600, 4, 2,
   '["4 visits per month","2 hours per visit","Same cleaner every week","Priority booking","10% discount vs one-off"]'::jsonb,
   true, 1),
  ('fortnightly', 'Fortnightly Clean', 'One visit every two weeks — our most popular plan.', 'price_fortnightly_puremaids', 10800, 2, 3,
   '["2 visits per month","3 hours per visit","Same cleaner every visit","Priority booking","5% discount vs one-off"]'::jsonb,
   true, 2),
  ('monthly_deep', 'Monthly Deep Clean', 'One thorough deep clean every month.', 'price_monthly_puremaids', 12900, 1, 5,
   '["1 deep clean per month","5 hours per visit","Includes oven & fridge clean","Same cleaner every month","Flexible rescheduling"]'::jsonb,
   true, 3)
ON CONFLICT (slug) DO NOTHING;
