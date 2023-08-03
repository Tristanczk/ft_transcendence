import React, { useEffect, useState } from 'react';
import axios from 'axios';

type User = { nickName: string; elo: number; loginNb: number };

const Settings: React.FC = () => {
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
        <div>This is the settings page my dude</div>
    ) : (
        <div>Loading...</div>
    );
};

export default Settings;
