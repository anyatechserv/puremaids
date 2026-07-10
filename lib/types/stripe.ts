export interface CheckoutRequest {
  bookingId: string;
  bookingReference: string;
  serviceType: string;
  serviceLabel: string;
  totalPricePence: number;
  depositPence: number;
  extras: { name: string; pricePence: number }[];
  customerEmail: string;
  customerName: string;
  paymentType: 'deposit' | 'full';
}

export interface SubscriptionCheckoutRequest {
  planId: string;
  priceId: string;
  planName: string;
  customerEmail: string;
  customerName: string;
}

export interface RefundRequest {
  paymentId: string;
  stripePaymentIntentId: string;
  amountPence: number;
  reason: string;
}

export interface CheckoutResponse {
  sessionId: string;
  url: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  monthlyPricePence: number;
  visitsPerMonth: number;
  hoursPerVisit: number;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Clean',
    description: 'One visit every week — ideal for busy households.',
    stripePriceId: 'price_weekly_puremaids',
    monthlyPricePence: 19600,
    visitsPerMonth: 4,
    hoursPerVisit: 2,
    features: [
      '4 visits per month',
      '2 hours per visit',
      'Same cleaner every week',
      'Priority booking',
      '10% discount vs one-off',
    ],
  },
  {
    id: 'fortnightly',
    name: 'Fortnightly Clean',
    description: 'One visit every two weeks — our most popular plan.',
    stripePriceId: 'price_fortnightly_puremaids',
    monthlyPricePence: 10800,
    visitsPerMonth: 2,
    hoursPerVisit: 3,
    features: [
      '2 visits per month',
      '3 hours per visit',
      'Same cleaner every visit',
      'Priority booking',
      '5% discount vs one-off',
    ],
    popular: true,
  },
  {
    id: 'monthly',
    name: 'Monthly Deep Clean',
    description: 'One thorough deep clean every month.',
    stripePriceId: 'price_monthly_puremaids',
    monthlyPricePence: 12900,
    visitsPerMonth: 1,
    hoursPerVisit: 5,
    features: [
      '1 deep clean per month',
      '5 hours per visit',
      'Includes oven & fridge clean',
      'Same cleaner every month',
      'Flexible rescheduling',
    ],
  },
];
