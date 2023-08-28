import React, { useContext, useState } from 'react';
import { User } from '../types';

interface Prop {
    user: User | null;
    loginUser: (userData: User | null) => void;
    logoutUser: () => void;
}

export const UserContext = React.createContext<Prop>({
	user: null,
	loginUser: () => {},
	logoutUser: () => {},
  });

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);

    const loginUser = (userData: User | null) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
