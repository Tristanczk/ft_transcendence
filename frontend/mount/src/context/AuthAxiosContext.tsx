// AuthAxiosProvider.tsx
import React, { useContext, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useUserContext } from './UserContext';

interface Props {
    authAxios: AxiosInstance;
}

const AuthAxiosContext = React.createContext<Props>({
    authAxios: axios.create({
        baseURL: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333`,
        headers: {
            'Content-Type': 'application/json',
        },
    }),
});

interface AuthAxiosProviderProps {
    children: ReactNode;
}

const AuthAxiosProvider: React.FC<AuthAxiosProviderProps> = ({ children }) => {
    const { logoutUser } = useUserContext();

    const authAxios = axios.create({
        baseURL: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    authAxios.interceptors.response.use(
        (response) => response,
        async (error: any) => {
            console.log('Interceptor activated');
            const originalRequest = error.config;
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest!._retry
            ) {
                originalRequest!._retry = true;
                try {
                    await axios.get(
                        `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/refresh`,
                        {
                            withCredentials: true,
                        },
                    );
                    return axios.request(originalRequest);
                } catch (refreshError) {
                    logoutUser();
                    throw refreshError;
                }
            } else {
                throw error;
            }
        },
    );

    return (
        <AuthAxiosContext.Provider value={{ authAxios }}>
            {children}
        </AuthAxiosContext.Provider>
    );
};

const useAuthAxios = (): AxiosInstance => {
    const context = useContext(AuthAxiosContext);
    if (!context) {
        throw new Error(
            'useAuthAxios must be used within an AuthAxiosProvider',
        );
    }
    return context.authAxios;
};

export { AuthAxiosProvider, useAuthAxios };
