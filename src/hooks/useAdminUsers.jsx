import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useAdminUsers = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => axiosSecure.get('/api/admin/users').then(res => res.data),
  });
};

export default useAdminUsers;
