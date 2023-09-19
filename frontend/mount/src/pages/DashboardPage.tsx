import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types';
import axios from 'axios';
import PresentationUser from '../components/dashboard/PresentationUser';
import Friends from '../components/dashboard/friends/Friends';
import StatsUser from '../components/dashboard/StatsUser';
import { useUserContext } from '../context/UserContext';
import NotConnected from '../components/NotConnected';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article className="mx-auto w-full max-w-4xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                {children}
            </article>
        </div>
    </main>
);

const NoUser: React.FC<{ idUserToView: string }> = ({ idUserToView }) => (
    <DashboardLayout>
        <h2 className="text-3xl font-extrabold dark:text-white">
            No user found
        </h2>
        <p className="mt-4 mb-4">
            '{idUserToView}' cannot be found on our server.
        </p>
    </DashboardLayout>
);

const DashboardPage: React.FC = () => {
    const { idUserToView } = useParams();
    const { user } = useUserContext();
    const [userData, setUserData] = useState<User | null>(null);
    const userId: number | null = idUserToView
        ? /\d+/.test(idUserToView)
            ? parseInt(idUserToView)
            : null
        : user?.id ?? null;
    const [error, setError] = useState(userId === null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${userId}`,
                    { withCredentials: true },
                );
                if (!response.data) throw new Error('No user foudnd');
                setUserData(response.data);
                setError(false);
            } catch (error) {
                setError(true);
                setUserData(null);
            }
        };
        if (userId !== null) fetchUser();
        else setUserData(null);
    }, [userId]);

    return userData ? (
        <DashboardLayout>
            <PresentationUser user={userData} />
            <Friends currUser={userData} />
            <StatsUser user={userData} />
        </DashboardLayout>
    ) : !error ? null : idUserToView ? (
        <NoUser idUserToView={idUserToView} />
    ) : (
        <NotConnected message="Please signup or log in to access your dashboard" />
    );
};

export default DashboardPage;
