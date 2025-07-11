import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.accessToken) return;

    // Set up request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(
      config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      error => Promise.reject(error)
    );

    // Set up response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(
      res => res,
      error => {
        const status = error.response?.status;
        if (status === 403) {
          navigate('/forbidden');
        } else if (status === 401) {
          logOut()
            .then(() => navigate('/auth/login'))
            .catch(() => {});
        }
        return Promise.reject(error);
      }
    );

    // Cleanup on unmount or when user changes
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
