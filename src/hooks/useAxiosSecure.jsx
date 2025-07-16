import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import app from '../firebase/firebase.init';

const auth = getAuth(app);

// Reusable function to wait until Firebase Auth is ready
const waitForAuth = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // stop listening once we get the user
      resolve(user);
    });
  });

// Create a secure Axios instance
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor to attach token
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser || await waitForAuth(); // ✅ wait for auth

        if (user) {
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        if (status === 403) {
          navigate('/forbidden', { replace: true });
          toast.error('You do not have permission to access this resource');
        } else if (status === 401) {
          logOut()
            .then(() => navigate('/auth/login', { replace: true }))
            .catch(() => toast.error('Error logging out.'));
        } else if (status === 500) {
          toast.error('Server error. Please try again later.');
        } else if (status === 400) {
          toast.error('Bad request. Please check your input.');
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
