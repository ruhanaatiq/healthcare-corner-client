import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { dispatch } = useContext(CartContext);

  const handleIncrease = () => dispatch({ type: 'INCREASE', payload: item._id });
  const handleDecrease = () => dispatch({ type: 'DECREASE', payload: item._id });
  const handleRemove = () => dispatch({ type: 'REMOVE', payload: item._id });

  return (
    <div className="border p-4 mb-2 rounded flex justify-between items-center shadow">
      <div>
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-sm text-gray-600">${item.price} per unit</p>
        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={handleIncrease} className="btn btn-sm bg-green-500 text-white">+</button>
        <button onClick={handleDecrease} className="btn btn-sm bg-yellow-400 text-white">−</button>
        <button onClick={handleRemove} className="btn btn-sm btn-error text-white">🗑</button>
      </div>
    </div>
  );
};

export default CartItem;
