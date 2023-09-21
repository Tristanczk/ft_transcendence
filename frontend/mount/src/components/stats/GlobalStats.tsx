import { useEffect, useState } from 'react';
import { StatsDashboard, User } from '../../types';
import axios from 'axios';

interface PresentationUserProps {
    user: User;
}

function GlobalStats({ user }: PresentationUserProps) {
    const textShow = 'p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800';

    const [stats, setStats] = useState<StatsDashboard | null>(null);

    useEffect(() => {
        if (user) getStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) getStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    async function getStats() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/stats/${user.id}`,
                {
                    withCredentials: true,
                },
            );
            setStats(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-3xl shadow dark:bg-gray-800 dark:border-gray-700 p-4 sm:p-8">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Statistics
            </h5>
            <div id="fullWidthTabContent">
                <div
                    className={textShow}
                    id="stats"
                    role="tabpanel"
                    aria-labelledby="stats-tab"
                >
                    <dl className="grid max-w-screen-xl grid-cols-1 sm:grid-cols-2 gap-8 p-4 mx-auto text-gray-900 dark:text-white sm:p-8">
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats ? stats?.me.nbGames : 'N/A'}
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                Games
                            </dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats ? stats?.me.nbWins : 'N/A'}
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                Wins
                            </dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats?.me.nbGames
                                    ? Math.round(
                                          (stats?.me.nbWins /
                                              stats?.me.nbGames) *
                                              100,
                                      )
                                    : 0}
                                %
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                Win rate
                            </dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats ? stats?.me.elo : 'N/A'}
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                Elo
                            </dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats && stats.me.averageDuration
                                    ? stats?.me.averageDuration > 60
                                        ? Math.trunc(
                                              stats?.me.averageDuration / 60,
                                          ) +
                                          'm' +
                                          (stats?.me.averageDuration % 60) +
                                          's'
                                        : stats?.me.averageDuration + 's'
                                    : 'N/A'}
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                Average game length
                            </dd>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <dt className="mb-2 text-3xl font-extrabold">
                                {stats ? stats?.me.daysSinceRegister : 'N/A'}
                            </dt>
                            <dd className="text-gray-500 dark:text-gray-400">
                                days since registration
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default GlobalStats;
