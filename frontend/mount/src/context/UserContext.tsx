import React, { useContext, useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';
import { useAuthAxios } from './AuthAxiosContext';

interface Prop {
    user: User | null;
    loginUser: (userData: User | null) => void;
    logoutUser: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const UserContext = React.createContext<Prop>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
    updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const authAxios = useAuthAxios();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // console.log('try user context');
                const response = await authAxios.get('/users/me', {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error: any) {
                console.error('user context refresh error', error);
                if (error.response && error.response.status === 401) {
                    try {
                        await axios.get(
                            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/refresh`,
                            {
                                withCredentials: true,
                            },
                        );
                        const response = await authAxios.get('/users/me', {
                            withCredentials: true,
                        });
                        setUser(response.data);
                    } catch (refreshError) {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
        };
        fetchUser();
    }, [authAxios]);

    const loginUser = (userData: User | null) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, ...userData };
            }
            return null;
        });
    };

    return (
        <UserContext.Provider
            value={{ user, loginUser, logoutUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
