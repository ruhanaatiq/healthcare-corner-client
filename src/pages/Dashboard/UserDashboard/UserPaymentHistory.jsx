import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UserPaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['user-payments', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Payment History</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Medicine</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay, index) => (
              <tr key={pay._id}>
                <td>{index + 1}</td>
                <td>{pay.medicineName}</td>
                <td>${pay.amount}</td>
                <td>{pay.transactionId}</td>
                <td className={pay.status === 'paid' ? 'text-green-500' : 'text-orange-500'}>
                  {pay.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPaymentHistory;
