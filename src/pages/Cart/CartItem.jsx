import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { dispatch } = useContext(CartContext);

  return (
    <div className="border p-4 mb-2 rounded flex justify-between items-center">
      <div>
        <h3 className="font-bold">{item.name}</h3>
        <p>${item.price} per unit</p>
        <p>Qty: {item.quantity}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => dispatch({ type: 'INCREASE', payload: item._id })} className="btn">+</button>
        <button onClick={() => dispatch({ type: 'DECREASE', payload: item._id })} className="btn">−</button>
        <button onClick={() => dispatch({ type: 'REMOVE', payload: item._id })} className="btn btn-error">🗑</button>
      </div>
    </div>
  );
};

export default CartItem;
