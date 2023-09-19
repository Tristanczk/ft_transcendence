import { useEffect, useState } from 'react';
import { StatsDashboard, User } from '../../types';
import axios from 'axios';

interface PresentationUserProps {
    user: User;
}

function GlobalStats({ user }: PresentationUserProps) {
    const [choice, setChoice] = useState(1);
    const textShow = 'p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800';
    const textHidden = 'hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800';

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
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <ul
                className="text-sm font-medium text-center text-gray-500 divide-y sm:divide-x sm:divide-y-0 divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400"
                id="fullWidthTab"
                data-tabs-toggle="#fullWidthTabContent"
                role="tablist"
            >
                <li className="-full py-2 sm:py-0">
                    <button
                        id="stats-tab"
                        data-tabs-target="#stats"
                        type="button"
                        role="tab"
                        aria-controls="stats"
                        aria-selected="true"
                        className="inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setChoice(1)}
                    >
                        Your statistics
                    </button>
                </li>
                <li className="-full py-2 sm:py-0">
                    <button
                        id="about-tab"
                        data-tabs-target="#about"
                        type="button"
                        role="tab"
                        aria-controls="about"
                        aria-selected="false"
                        className="inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                        onClick={() => setChoice(2)}
                    >
                        Our service
                    </button>
                </li>
            </ul>
            <div
                id="fullWidthTabContent"
                className="border-t border-gray-200 dark:border-gray-600"
            >
                <div
                    className={choice === 1 ? textShow : textHidden}
                    id="stats"
                    role="tabpanel"
                    aria-labelledby="stats-tab"
                >
                    <dl className="grid max-w-screen-xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 p-4 mx-auto text-gray-900 dark:text-white sm:p-8">
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
            <div
                className={choice === 2 ? textShow : textHidden}
                id="about"
                role="tabpanel"
                aria-labelledby="about-tab"
            >
                <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    On our site
                </h2>
                <ul className="space-y-4 text-gray-500 dark:text-gray-400">
                    <li className="-full py-2 sm:py-0">
                        <svg
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="leading-tight">
                            {stats ? stats?.global.nbGames : 'N/A'}+ brilliants
                            games
                        </span>
                    </li>
                    <li className="-full py-2 sm:py-0">
                        <svg
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="leading-tight">
                            Fun for {stats ? stats?.global.nbUsers : 'N/A'}+
                            users
                        </span>
                    </li>
                    <li className="-full py-2 sm:py-0">
                        <svg
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="leading-tight">
                            Average Elo of{' '}
                            {stats ? stats?.global.averageElo : 'N/A'}
                        </span>
                    </li>
                    <li className="-full py-2 sm:py-0">
                        <svg
                            className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600 dark:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="leading-tight">
                            A passionnate team
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default GlobalStats;
