import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://b11a12-server-side-ruhanaatiq.vercel.app`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;