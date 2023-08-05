import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/get-user-info',
                    { withCredentials: true },
                );
                console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return user ? (
        <div>
            Welcome, {user.nickname}! Your current ELO is {user.elo}. This is
            the {user.loginNb}th time you log in. Double authentication for your
            account is set to {user.doubleAuthentication ? 'true' : 'false'}.
        </div>
    ) : (
        <div>You are not logged in.</div>
    );
};

export default DashboardPage;
