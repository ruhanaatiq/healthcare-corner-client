
import { useEffect } from "react";
import useRole from '../../hooks/useRole';
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from './AdminDashboard/AdminDashboardLayout';
import SellerDashboardLayout from './SellerDashboard/SellerDashboardLayout';
import UserDashboardLayout from './UserDashboard/UserDashboardLayout';

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
        navigate('/dashboard/payment-history', { replace: true });
      }
    }
  }, [role, loading, navigate]);


  return null; // Or a fallback screen while redirecting
};
export default DashboardLayout;
