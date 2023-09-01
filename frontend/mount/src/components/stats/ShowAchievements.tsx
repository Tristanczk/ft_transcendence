import { useEffect, useState } from 'react';
import { User } from '../../types';
import axios from 'axios';

interface PresentationUserProps {
    user: User;
}

interface ImgAchievProps {
    achievement: AchievType;
}

type AchievType = {
	id: string,
	title: string,
	description: string,
}

function ShowAchievements({ user }: PresentationUserProps) {
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
                `http://localhost:3333/games/achiev/${user?.id}`,
                {
                    withCredentials: true,
                },
            );
            setAchiev(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="w-full  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                        Achievements
                    </h5>
                </div>
                <div
                    className="flow-root"
                    style={{ display: 'flex', flexWrap: 'wrap' }}
                >
                    {dataAchiev && dataAchiev.length > 0
                        ? dataAchiev.map((elem) => (
                              <ShowImageAchievement
                                  achievement={elem}
                                  key={elem.id}
                              />
                          ))
                        : `No achievements yet`}
                </div>
            </div>
        </>
    );
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
                <div className="w-64 h-auto absolute z-10 opacity-0 group-hover:opacity-100 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white ">
                            {achievement.title}
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p>
						{achievement.description}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShowAchievements;
