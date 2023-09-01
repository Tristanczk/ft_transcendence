import { useEffect, useState } from 'react';
import { GameImports } from '../../types';
import axios from 'axios';
import { format } from 'date-fns';
import { User } from '../../types';
import { Link } from 'react-router-dom';

interface PresentationUserProps {
    user: User;
}

function HistoryFive({ user }: PresentationUserProps) {
    const [games, setGames] = useState<GameImports[] | null>(null);

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
                `http://localhost:3333/games/short/${user?.id}`,
                {
                    withCredentials: true,
                },
            );
            setGames(response.data);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return games ? (
        <div className="w-full  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    Last Games
                </h5>
                {/* <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                    View all
                </a> */}
            </div>
            <div className="flow-root">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {games.length > 0 &&
                        games.map((game) => (
                            <li className="py-3 sm:py-4" key={game.gameId}>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {game.mode === 1 ? (
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 22 21"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeWidth="2"
                                                    d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-6 h-6 text-gray-800 dark:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9 19V.352A3.451 3.451 0 0 0 7.5 0a3.5 3.5 0 0 0-3.261 2.238A3.5 3.5 0 0 0 2.04 6.015a3.518 3.518 0 0 0-.766 1.128c-.042.1-.064.209-.1.313a3.34 3.34 0 0 0-.106.344 3.463 3.463 0 0 0 .02 1.468A4.016 4.016 0 0 0 .3 10.5l-.015.036a3.861 3.861 0 0 0-.216.779A3.968 3.968 0 0 0 0 12a4.032 4.032 0 0 0 .107.889 4 4 0 0 0 .2.659c.006.014.015.027.021.041a3.85 3.85 0 0 0 .417.727c.105.146.219.284.342.415.072.076.148.146.225.216.1.091.205.179.315.26.11.081.2.14.308.2.02.013.039.028.059.04v.053a3.506 3.506 0 0 0 3.03 3.469 3.426 3.426 0 0 0 4.154.577A.972.972 0 0 1 9 19Zm10.934-7.68a3.956 3.956 0 0 0-.215-.779l-.017-.038a4.016 4.016 0 0 0-.79-1.235 3.417 3.417 0 0 0 .017-1.468 3.387 3.387 0 0 0-.1-.333c-.034-.108-.057-.22-.1-.324a3.517 3.517 0 0 0-.766-1.128 3.5 3.5 0 0 0-2.202-3.777A3.5 3.5 0 0 0 12.5 0a3.451 3.451 0 0 0-1.5.352V19a.972.972 0 0 1-.184.546 3.426 3.426 0 0 0 4.154-.577A3.506 3.506 0 0 0 18 15.5v-.049c.02-.012.039-.027.059-.04.106-.064.208-.13.308-.2s.214-.169.315-.26c.077-.07.153-.14.225-.216a4.007 4.007 0 0 0 .459-.588c.115-.176.215-.361.3-.554.006-.014.015-.027.021-.041.087-.213.156-.434.205-.659.013-.057.024-.115.035-.173.046-.237.07-.478.073-.72a3.948 3.948 0 0 0-.066-.68Z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white hover:font-bold">
                                            <Link
                                                to={
                                                    '/dashboard/' +
                                                    game.playerA?.id
                                                }
                                            >
                                                {game.playerA?.nickname} (
                                                {game.playerA?.eloStart})
                                            </Link>
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white hover:font-bold">
                                            <Link
                                                to={
                                                    '/dashboard/' +
                                                    game.playerB?.id
                                                }
                                            >
                                                {game.playerB?.nickname} (
                                                {game.playerB?.eloStart})
                                            </Link>
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-0 items-center justify-center text-base font-semibold text-gray-900 dark:text-white">
                                        {(game.playerA?.id === user?.id &&
                                            game.won) ||
                                        (game.playerB?.id === user?.id &&
                                            !game.won) ? (
                                            <button className="text-white bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                <svg
                                                    className="w-2 h-2"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M7 1v12m6-6H1"
                                                    />
                                                </svg>
                                                <span className="sr-only">
                                                    Icon description
                                                </span>
                                            </button>
                                        ) : (
                                            <button className="text-white bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                <svg
                                                    className="w-2 h-2"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2 7H12"
                                                    />
                                                </svg>
                                                <span className="sr-only">
                                                    Icon description
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                            {game.playerA?.score}/
                                            {game.playerB?.score}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {game.duration > 60
                                            ? Math.trunc(game.duration / 60) +
                                              'm' +
                                              (game.duration % 60) +
                                              's'
                                            : (game.duration > 0
                                                  ? game.duration
                                                  : 0) + 's'}
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                        {format(
                                            new Date(game.date),
                                            'MMM d, yyyy',
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    ) : (
        <></>
    );
}

export default HistoryFive;
