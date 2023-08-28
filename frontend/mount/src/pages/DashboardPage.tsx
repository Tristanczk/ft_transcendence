import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import PresentationUser from '../components/dashboard/PresentationUser';
import StatsUser from '../components/dashboard/StatsUser';
import Friends from '../components/dashboard/Friends';
import authAxios from '../axios';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // import current user
            try {
                const response = await authAxios.get('/users/me', {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error('axios error: ', error);
            }
            // import user list
            try {
                const response = await authAxios.get('/users/', {
                    withCredentials: true,
                });
                setUserList(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return user ? (
        <>
            <PresentationUser user={user} />
            <Friends user={user} userList={userList} />
            <StatsUser user={user} />
        </>
    ) : (
        <div>You are not logged in.</div>
    );
};

export default DashboardPage;
