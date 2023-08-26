import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import PresentationUser from '../components/dashboard/PresentationUser';
import StatsUser from '../components/dashboard/StatsUser';
import Friends from '../components/dashboard/friends/Friends';
import AvatarUploader from '../components/user/AvatarUpload';
import { UserContext } from '../context/UserContext';

const DashboardPage: React.FC = () => {
    const [userr, setUser] = useState<User | null>(null);
    // const [userList, setUserList] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // import current user
            // try {
            //     const response = await axios.get(
            //         'http://localhost:3333/users/me',
            //         { withCredentials: true },
            //     );
            //     setUser(response.data);
            // } catch (error) {
            //     console.error(error);
            // }

        };
        fetchUser();
    }, []);

	const userGlobal = useContext(UserContext);
	const user = userGlobal.user

	


    return user ? (
        <>
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
            <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    <PresentationUser user={user} />
                    {/* <AvatarUploader /> */}
                    <Friends user={user} />
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
