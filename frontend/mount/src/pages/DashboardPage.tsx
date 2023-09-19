import React, { useEffect, useState } from 'react';
import PresentationUser from '../components/dashboard/PresentationUser';
import StatsUser from '../components/dashboard/StatsUser';
import Friends from '../components/dashboard/friends/Friends';
import { useUserContext } from '../context/UserContext';
import NotConnected from '../components/NotConnected';
import axios from 'axios';
import { User } from '../types';

const DashboardPage: React.FC = () => {
    const { user } = useUserContext();

    const [userData, setUser] = useState<User | null>(null);

    const fetchUser = async () => {
        try {
            if (!user) return;
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${user?.id}`,
                { withCredentials: true },
            );
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return user ? (
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
            <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                <article className="mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    <PresentationUser user={userData} />
                    <Friends currUser={user} />
                    <StatsUser user={user} />
                </article>
            </div>
        </main>
    ) : (
        <NotConnected message="Please signup or log in to access your dashboard" />
    );
};

export default DashboardPage;
