import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../Shared/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => (
  <div className="max-w-xl mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4">Checkout</h2>
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  </div>
);

export default CheckoutPage;
