import React from 'react';
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

const Invoice = () => {
  const location = useLocation();
  const order = location.state; // passed via navigate

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  if (!order) return <p>No order found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div ref={componentRef} className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">Invoice</h1>
        <p className="mb-2">Customer: {order.userName}</p>
        <ul>
          {order.items.map(item => (
            <li key={item._id}>{item.name} - {item.quantity} x ${item.price}</li>
          ))}
        </ul>
        <p className="mt-4 font-bold">Total: ${order.total}</p>
      </div>
      <button onClick={handlePrint} className="btn btn-primary mt-4">Print Invoice</button>
    </div>
  );
};

export default Invoice;
