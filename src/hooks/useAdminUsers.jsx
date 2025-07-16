import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth'; // import the auth hook

const useAdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  return useQuery({
    queryKey: ['admin-users', user?.email], // optionally add user email
    enabled: !loading && !!user, // 🔥 waits until auth is ready
    queryFn: () =>
      axiosSecure.get('/api/admin/users').then(res => res.data),
  });
};

export default useAdminUsers;
