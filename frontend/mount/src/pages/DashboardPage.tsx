import React from 'react';
import PresentationUser from '../components/dashboard/PresentationUser';
import StatsUser from '../components/dashboard/StatsUser';
import Friends from '../components/dashboard/friends/Friends';
import { useUserContext } from '../context/UserContext';

const DashboardPage: React.FC = () => {
    const { user } = useUserContext();
    console.log('user', user);

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
