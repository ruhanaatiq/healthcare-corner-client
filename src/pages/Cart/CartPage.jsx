import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => <CartItem key={item._id} item={item} />)}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
            <div>
              <button onClick={clearCart} className="btn btn-error mr-4">Clear Cart</button>
              <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
