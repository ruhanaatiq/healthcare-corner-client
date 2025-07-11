import React, { useContext, useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { CartContext } from '../../../contexts/CartContext';
import useAuth from '../../../hooks/useAuth';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { cart, dispatch } = useContext(CartContext);
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Create PaymentIntent mutation
  const createPaymentIntent = useMutation({
    mutationFn: (amount) =>
      axiosSecure.post('/api/create-payment-intent', { amount }).then(res => res.data),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    if (total > 0) {
      createPaymentIntent.mutate(total);
    }
  }, [total]);

  // Handle payment form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (error) {
      console.error(error);
    } else {
      // Save the order to the backend
      const order = {
        userName: user?.displayName || 'Anonymous',
        userEmail: user?.email,
        items: cart,
        total,
        paymentId: paymentIntent.id,
        status: 'pending', // Default status
        createdAt: new Date().toISOString(),
      };

      try {
        const res = await axiosSecure.post('/api/orders', order);
        dispatch({ type: 'CLEAR' });
navigate(`/invoice/${res.data.insertedId}`, { state: { order } });      } catch (err) {
        console.error('Order saving failed:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="btn btn-primary mt-4"
      >
        Pay ${total.toFixed(2)}
      </button>
    </form>
  );
};

export default PaymentForm;
