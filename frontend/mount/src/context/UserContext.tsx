import React, { useContext, useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';

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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    { withCredentials: true },
                );
                setUser(response.data);
            } catch (error) {
                console.error(error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

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
