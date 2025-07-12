import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxios from './useAxiosSecure';

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxios();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (authLoading) return; // Don't fetch if auth is still loading

      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/api/users/role/${user.email}`);
          setRole(res.data?.role);
        } catch (err) {
          console.error('❌ Failed to fetch role', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.email, axiosSecure, authLoading]);

  return { role, loading };
};

export default useRole;
