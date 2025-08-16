import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useAdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ['admin-users', user?.email],
    enabled: !loading && !!user,
    queryFn: () =>
      axiosSecure.get('/users').then(res => res.data), // ✅ fixed
  });
};

export default useAdminUsers;
