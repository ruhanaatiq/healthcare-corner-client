import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
  baseURL: ` http://localhost:5000`
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.accessToken) return;

    const requestInterceptor = axiosSecure.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;

        if (status === 403) {
          navigate('/forbidden', { replace: true });
        } else if (status === 401) {
          logOut()
            .then(() => navigate('/auth/login', { replace: true }))
            .catch(() => {});
        }

        return Promise.reject(error);
      }
    );

    // ✅ Clean up interceptors when user changes or component unmounts
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user?.accessToken, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
