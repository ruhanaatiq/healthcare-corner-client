import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxios from './useAxiosSecure';

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxios();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchRole = async () => {
      if (authLoading) return; // wait for Firebase auth to settle

      if (user?.email) {
        try {
          const url = `/users/role/${encodeURIComponent(user.email)}`; // ✅ no extra /api
          const res = await axiosSecure.get(url);
          if (!ignore) setRole(res.data?.role ?? null);
        } catch (err) {
          // Helpful debugging
          const status = err.response?.status;
          const data = err.response?.data;
          console.error('❌ Failed to fetch role:', status, data || err.message);
          if (!ignore) setRole(null);
        } finally {
          if (!ignore) setLoading(false);
        }
      } else {
        setRole(null);
        setLoading(false);
      }
    };

    fetchRole();
    return () => { ignore = true; };
  }, [user?.email, authLoading]); // axiosSecure is stable; omit to avoid refires

  return { role, loading };
};

export default useRole;
