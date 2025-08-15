import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await axiosSecure.get('/payments');
      return res.data;
    }
  });

  const approvePayment = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/payments/${id}`),
    onSuccess: () => {
      toast.success('Payment approved!');
      queryClient.invalidateQueries(['payments']);
    },
    onError: () => {
      toast.error('Failed to approve payment.');
    }
  });

  if (isLoading) return <p>Loading payments...</p>;
  if (isError) return <p>Error fetching payments.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-red-800">Manage Payments</h2>
      <table className="table">
        <thead className='text-red-800'>
          <tr>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment._id}>
              <td className='text-red-800'>{payment.userName}</td>
              <td className='text-red-800'> ${payment.total?.toFixed(2)}</td>
              <td>
                <span className={`badge ${payment.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {payment.status}
                </span>
              </td>
              <td>
                {payment.status === 'pending' && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approvePayment.mutate(payment._id)}
                  >
                    Accept Payment
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayments;
