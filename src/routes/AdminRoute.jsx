import { Navigate } from 'react-router-dom';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;
