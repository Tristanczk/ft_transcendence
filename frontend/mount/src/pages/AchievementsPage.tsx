import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import { AchievType } from '../components/stats/ShowAchievements';

function AchievementPage() {
    const { user } = useUserContext();
    const [dataAchiev, setAchiev] = useState<AchievType[] | null>(null);

    useEffect(() => {
        if (user) getGamesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) getGamesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    async function getGamesList() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/games/achiev/${user?.id}`,
                {
                    withCredentials: true,
                },
            );
            setAchiev(response.data);
            return response.data;
        } catch (error) {
            setAchiev(null);
        }
    }

    return (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <h1 className="mb-4 text-5xl font-extrabold dark:text-white">
                            Achievements
                        </h1>
                        {dataAchiev && dataAchiev.length > 0 ? (
                            dataAchiev.map((elem) => (
                                <ShowAchievElem
                                    achievement={elem}
                                    key={elem.id}
                                />
                            ))
                        ) : (
                            <div className="mt-4">
                                No achievements available
                            </div>
                        )}
                    </article>
                </div>
            </main>
        </>
    );
}

export default AchievementPage;

interface ImgAchievProps {
    achievement: AchievType;
}

function ShowImageAchievement({ achievement }: ImgAchievProps) {
    const source: string = '/achievements/' + achievement.id + '.png';

    return (
        <>
            <div className="relative group">
                <img
                    className="w-20"
                    src={source}
                    alt={achievement.id}
                    key={achievement.id}
                    data-popover-target={achievement.id}
                />
            </div>
        </>
    );
}

function ShowAchievElem({ achievement }: ImgAchievProps) {
    let classStyle: string =
        'bg-gray-300 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center';
    if (achievement.userHave)
        classStyle =
            'bg-emerald-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center';
    return (
        <div className={classStyle}>
            <div className="flex-shrink-0">
                <ShowImageAchievement achievement={achievement} />
            </div>
            <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
                    {achievement.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">
                        {achievement.description}
                    </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="">
                        {achievement.userHave
                            ? 'You already have this achievement'
                            : 'Play a game to try to get this achievement'}
                    </span>
                </p>
            </div>
        </div>
    );
}
