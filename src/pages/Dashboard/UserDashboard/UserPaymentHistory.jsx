import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const UserPaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get('/api/payments');
        const filtered = res.data.filter(p => p.userEmail === user.email);
        setPayments(filtered);
      } catch (err) {
        console.error("❌ Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, [user, axiosSecure]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Payment History</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, idx) => (
            <div key={idx} className="border p-4 rounded shadow bg-white">
              <p><strong>Total:</strong> ${payment.total}</p>
              <p><strong>Status:</strong> {payment.status}</p>
              <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
              <p><strong>Payment ID:</strong> {payment.paymentId}</p>
              <ul className="mt-2 list-disc pl-5">
                {payment.items?.map((item, i) => (
                  <li key={i}>{item.name} - ${item.price}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPaymentHistory;
