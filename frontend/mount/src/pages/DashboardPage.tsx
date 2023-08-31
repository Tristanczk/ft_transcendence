import React, { useEffect, useState } from 'react';
import PresentationUser from '../components/dashboard/PresentationUser';
import StatsUser from '../components/dashboard/StatsUser';
import Friends from '../components/dashboard/friends/Friends';
import { useUserContext } from '../context/UserContext';
import { useParams } from 'react-router-dom';
import { User } from '../types';
import axios from 'axios';

const DashboardPage: React.FC = () => {
    const { user } = useUserContext();
    // const [userView, setUser] = useState<User | null>(null);
    // const { idUserToView } = useParams();

    // let userId: number = -2;
    // if (idUserToView) {
    //     userId = parseInt(idUserToView);
    // } else {
    //     userId = user ? user?.id : -1;
    // }

    // useEffect(() => {
    //     fetchUser(userId);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [userId]);

    // async function fetchUser(id: number) {
    //     try {
    //         if (id === -1) {
    //             setUser(user);
    //             return;
    //         }
    //         const response = await axios.get(
    //             `http://localhost:3333/users/${id}`,
    //             { withCredentials: true },
    //         );
    //         setUser(response.data);
    //     } catch (error) {
    //         setUser(null);
    //     }
    // };

    return user ? (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <PresentationUser user={user} />
                        {/* <AvatarUploader /> */}
                        <Friends currUser={user} />
                        <StatsUser user={user} />
                    </article>
                </div>
            </main>
        </>
    ) : (
        <div>You are not logged in.</div>
    );
};

export default DashboardPage;
