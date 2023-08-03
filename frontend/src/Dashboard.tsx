import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = { nickName: string; elo: number; loginNb: number };

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/get-user-info',
                    {
                        withCredentials: true,
                    },
                );
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return user ? (
        <div>
            Welcome, {user.nickName}! Your current ELO is {user.elo}. This is
            the {user.loginNb}th time you log in.
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default Dashboard;
