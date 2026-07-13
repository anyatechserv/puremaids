export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly', name: 'Weekly Clean',
    description: 'Ideal for busy households that want a consistently spotless home.',
    priceId: 'price_weekly_puremaids', monthlyPence: 19600,
    visitsPerMonth: 4, hoursPerVisit: 2, popular: false,
    features: ['4 visits per month','2 hrs per visit','Same cleaner every week','Priority booking','10% saving vs one-off'],
  },
  {
    id: 'fortnightly', name: 'Fortnightly Clean',
    description: 'Our most popular plan — regular cleaning without the weekly commitment.',
    priceId: 'price_fortnightly_puremaids', monthlyPence: 10800,
    visitsPerMonth: 2, hoursPerVisit: 3, popular: true,
    features: ['2 visits per month','3 hrs per visit','Same cleaner every visit','Priority booking','5% saving vs one-off'],
  },
  {
    id: 'monthly_deep', name: 'Monthly Deep Clean',
    description: 'One thorough deep clean every month — includes oven and fridge.',
    priceId: 'price_monthly_puremaids', monthlyPence: 12900,
    visitsPerMonth: 1, hoursPerVisit: 5, popular: false,
    features: ['1 deep clean per month','5 hrs per visit','Oven & fridge included','Same cleaner every month','Free rescheduling'],
  },
] as const;
