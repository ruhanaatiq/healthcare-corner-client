import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import logo from '../../assets/logo.png';

const Invoice = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const componentRef = useRef(null);
  const [order, setOrder] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);

  // Fetch order by ID
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosSecure.get(`/api/orders/${id}`);
        setOrder(res.data);
              setTimeout(() => setReadyToPrint(true), 300);
      } catch (err) {
        console.error('Error fetching invoice:', err);
      }
    };
    fetchOrder();
  }, [id,axiosSecure]);

  // Print logic (won’t run until `componentRef.current` is not null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${order?.userName || 'User'}`,
  });

  if (!order) return <p className="text-center mt-10 text-red-500">No order found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div ref={componentRef} className="bg-white p-6 rounded shadow border">
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
        </div>

        <div className="mb-4 text-gray-700">
          <p><strong>Customer:</strong> {order.userName}</p>
          <p><strong>Email:</strong> {order.userEmail}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <table className="w-full border border-collapse text-left">
          <thead>
            <tr className="bg-red-600 border-b">
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={item._id} className="border-b text-red-600">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">${item.price.toFixed(2)}</td>
                <td className="p-2 border">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4">
          <h3 className="text-xl font-bold text-gray-800">
            Total: ${order.total?.toFixed(2)}
          </h3>
        </div>
      </div>

      {readyToPrint && (
  <div className="text-center mt-6">
    <button onClick={handlePrint} className="btn btn-primary">
      Download PDF
    </button>
  </div>
)}
    </div>
  );
};

export default Invoice;
