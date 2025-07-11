import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';

const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (loading || roleLoading) return <div>Loading...</div>;

  if (user && role === 'seller') return children;

  return <Navigate to="/forbidden" />;
};

export default SellerRoute;
