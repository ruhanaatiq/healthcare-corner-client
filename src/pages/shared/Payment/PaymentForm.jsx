import React, { useEffect, useState } from 'react';
import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [amount] = useState(100); // Replace with dynamic total from cart

  // 1. Create payment intent
  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, { amount })
      .then(res => setClientSecret(res.data.clientSecret))
      .catch(err => toast.error('Failed to initiate payment.'));
  }, [amount]);

  // 2. Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      toast.error(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // 3. Save order info to DB
      const order = {
        userEmail: user.email,
        amount,
        items: [], // Optional: Add actual cart items
        status: 'pending',
        transactionId: paymentIntent.id,
      };

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, order);
        toast.success('Payment successful and order saved!');
      } catch (err) {
        toast.error('Payment succeeded, but failed to save order.');
      }

      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded-md" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentForm;
