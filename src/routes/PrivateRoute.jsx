import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
};

export default PrivateRoute;