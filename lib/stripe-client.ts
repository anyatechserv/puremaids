import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from './stripe-config';

export const getStripe = () => loadStripe(STRIPE_PUBLISHABLE_KEY);
