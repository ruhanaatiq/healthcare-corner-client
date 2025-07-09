import React, { useContext, useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CartContext } from '../../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { cart, dispatch } = useContext(CartContext);
  const [clientSecret, setClientSecret] = useState('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createPaymentIntent = useMutation({
    mutationFn: (amount) =>
      axios.post('/api/create-payment-intent', { amount }).then(res => res.data),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    }
  });

  useEffect(() => {
    if (total > 0) {
      createPaymentIntent.mutate(total);
    }
  }, [total]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (error) {
      console.error(error);
    } else {
      const order = {
        userName: 'Test User', // replace with actual user
        items: cart,
        total,
        paymentId: paymentIntent.id
      };

      // Save order to backend (optional)
      const res = await axios.post('/api/orders', order);
      dispatch({ type: 'CLEAR' });
      navigate('/invoice', { state: res.data }); // pass order as state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded" />
      <button disabled={!stripe || !clientSecret} className="btn btn-primary mt-4">
        Pay ${total.toFixed(2)}
      </button>
    </form>
  );
};

export default PaymentForm;
