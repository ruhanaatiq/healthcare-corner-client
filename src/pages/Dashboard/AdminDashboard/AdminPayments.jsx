import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../hooks/useAxiosSecure';

const AdminPayments = () => {
  const queryClient = useQueryClient();

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/payments');
      return res.data;
    }
  });

  const approvePayment = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/payments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
    }
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Payments</h2>
      <table className="table">
        <thead>
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
              <td>{payment.userName}</td>
              <td>${payment.total.toFixed(2)}</td>
              <td>{payment.status}</td>
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
