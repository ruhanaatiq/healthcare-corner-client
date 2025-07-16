// CartContext.jsx
import React, { createContext, useReducer, useEffect, useContext } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { AuthContext } from '../contexts/AuthContext';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      const existing = state.find(item => item._id === action.payload._id);
      if (existing) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    case 'INCREASE':
      return state.map(item =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'DECREASE':
      return state
        .map(item =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
    case 'REMOVE':
      return state.filter(item => item._id !== action.payload);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
const { user, loading } = useContext(AuthContext);  const axiosSecure = useAxiosSecure();

 useEffect(() => {
  const fetchCart = async () => {
    if (!loading && user?.email) {
      try {
        const res = await axiosSecure.get(`/api/cart/${user.email}`);
        dispatch({ type: 'SET', payload: res.data || [] });
      } catch (err) {
        console.error('Cart fetch error:', err);
      }
    }
  };
  fetchCart();
}, [user?.email, loading]); // ✅ include loading
// 💡 safest dependency
useEffect(() => {
  const saveCart = async () => {
    if (!loading && user?.email) {
      try {
        await axiosSecure.post('/api/cart', {
          userEmail: user.email,
          cartItems: cart,
        });
      } catch (err) {
        console.error('Cart save error:', err);
      }
    }
  };
  saveCart();
}, [cart, user?.email, loading]); // ✅ include loading


  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
