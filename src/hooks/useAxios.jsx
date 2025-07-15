import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true // ✅ important if using Firebase Auth or secure endpoints
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
