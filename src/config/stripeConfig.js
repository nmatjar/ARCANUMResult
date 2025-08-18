import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '../services/apiService';

// Test publishable key - replace with your actual test key in production
const STRIPE_PUBLISHABLE_KEY = {
  // These are placeholder keys - replace with your actual keys
  local: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
  production: 'pk_test_TYooMQauvdEDq54NiTphI7jx' // Replace this with your real test key
};

// Initialize Stripe outside of components to avoid recreation on re-renders
// This ensures we only create the Stripe instance once
let stripePromise;

export const getStripe = () => {
  // Get the appropriate key based on environment
  const key = STRIPE_PUBLISHABLE_KEY[ENV.current];
  
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
};