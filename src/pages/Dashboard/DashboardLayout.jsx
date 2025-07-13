import { useEffect } from "react";
import useRole from '../../hooks/useRole';
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { role, loading } = useRole();

  useEffect(() => {
    if (!loading && role) {
      if (role === 'admin') {
        navigate('/dashboard/admin', { replace: true });
      } else if (role === 'seller') {
        navigate('/dashboard/seller', { replace: true });
      } else {
        navigate('/dashboard/user/payment-history', { replace: true }); // ✅ Corrected
      }
    }
  }, [role, loading, navigate]);

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  return null;
};
export default DashboardLayout;
