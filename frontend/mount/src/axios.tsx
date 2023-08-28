import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const authAxios = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
    },
});

authAxios.interceptors.response.use(
    (response) => response,
    async (error: any) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest!._retry
        ) {
            originalRequest!._retry = true;
            try {
                await axios.get('http://localhost:3333/auth/refresh', {
                    withCredentials: true,
                });
                return axios.request(originalRequest);
            } catch (refreshError) {
                throw refreshError;
            }
        } else {
            throw error;
        }
    },
);

export default authAxios;
