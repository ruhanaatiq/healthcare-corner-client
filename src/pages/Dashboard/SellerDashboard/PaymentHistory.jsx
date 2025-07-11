import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/payments?sellerEmail=${user.email}`)
        .then(res => setPayments(res.data))
        .catch(() => console.error('Failed to fetch payments'));
    }
  }, [user, axiosSecure]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Medicine</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.buyerEmail}</td>
                <td>{payment.medicineName}</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;