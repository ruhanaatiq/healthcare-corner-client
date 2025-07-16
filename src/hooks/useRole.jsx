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
      if (authLoading) return; // Wait until Firebase finishes

      if (user?.email) {
        try {
          const res = await axiosSecure.get(`/api/users/role/${user.email}`);
          setRole(res.data?.role || null);
        } catch (err) {
          console.error('❌ Failed to fetch role:', err);
          setRole(null);
        } finally {
          setLoading(false);
        }
      } else {
        setRole(null);
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.email, authLoading, axiosSecure]);

  return { role, loading };
};

export default useRole;
