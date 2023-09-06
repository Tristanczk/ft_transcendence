import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../types';
import axios from 'axios';
import PresentationUser from '../components/dashboard/PresentationUser';
import Friends from '../components/dashboard/friends/Friends';
import StatsUser from '../components/dashboard/StatsUser';

const UserPage: React.FC = () => {
    const { idUserToView } = useParams();
    const [user, setUser] = useState<User | null>(null);

    let userId: number = -1;
    if (idUserToView) {
        userId = parseInt(idUserToView);
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${userId}`,
                    { withCredentials: true },
                );
                setUser(response.data);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
        user && (
            <>
                <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                    <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                        <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                            <PresentationUser user={user} />
                            <Friends currUser={user} />
                            <StatsUser user={user} />
                        </article>
                    </div>
                </main>
            </>
        )
    );
};

export default UserPage;
