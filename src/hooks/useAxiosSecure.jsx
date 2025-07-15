import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Optional: For displaying error messages

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
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
          // Redirect to forbidden page
          navigate('/forbidden', { replace: true });
          toast.error('You do not have permission to access this resource');
        } else if (status === 401) {
          // Log out and redirect to login page if unauthorized
          logOut()
            .then(() => navigate('/auth/login', { replace: true }))
            .catch(() => toast.error('Error logging out.'));
        } else if (status === 500) {
          // Handle server errors
          toast.error('Server error. Please try again later.');
        } else if (status === 400) {
          // Handle client-side errors
          toast.error('Bad request. Please check your input.');
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptors when the component is unmounted or the user changes
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user?.accessToken, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
