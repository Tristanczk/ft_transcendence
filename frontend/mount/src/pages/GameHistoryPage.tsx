import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { GameImports } from '../types';

function GameHistoryPage() {
    const [dataGames, setGames] = useState<GameImports[] | null>(null);
    const { idUserToView } = useParams();

    let userId: number = -1;
    if (idUserToView) {
        userId = parseInt(idUserToView);
        if (!userId) userId = -1;
    }

    useEffect(() => {
        if (userId !== -1) getGamesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    async function getGamesList() {
        try {
            if (userId === -1) return;
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/games/all/${userId}`,
                {
                    withCredentials: true,
                },
            );
            setGames(response.data);
            return response.data;
        } catch (error) {
            setGames(null);
        }
    }

    return dataGames && userId !== -1 ? (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <h1 className="mb-4 text-5xl font-extrabold dark:text-white">
                            Game history
                            {dataGames.length > 0
                                ? ` of ${
                                      dataGames[0].playerA.id === userId
                                          ? dataGames[0].playerA.nickname
                                          : dataGames[0].playerB.nickname
                                  }`
                                : ''}
                        </h1>
                        {dataGames && dataGames.length > 0 ? (
                            dataGames.map((elem) => (
                                <ShowGameElem
                                    game={elem}
                                    userId={userId}
                                    key={elem.gameId}
                                />
                            ))
                        ) : (
                            <div className="mt-4">
                                No games available for user
                            </div>
                        )}
                    </article>
                </div>
            </main>
        </>
    ) : (
        <NoUser></NoUser>
    );
}

export default GameHistoryPage;

interface ShowGameProps {
    game: GameImports;
    userId: number;
}

function ShowGameElem({ game, userId }: ShowGameProps) {
    let classStyle: string =
        'bg-red-300 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center';
    if (
        (game.playerA?.id === userId && game.won) ||
        (game.playerB?.id === userId && !game.won)
    )
        classStyle =
            'bg-emerald-100 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center';
    if (game.finished === false)
        classStyle =
            'bg-amber-300 dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center';
    return (
        <div className={classStyle}>
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
            <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white hover:font-bold">
                        {game.playerA?.id !== -1 ? (
                            <Link to={'/dashboard/' + game.playerA?.id}>
                                {game.playerA?.nickname} (
                                {game.playerA?.eloStart})
                            </Link>
                        ) : (
                            game.playerA?.nickname
                        )}
                    </span>
                    {' vs '}
                    <span className="text-sm font-medium text-gray-900 truncate dark:text-white hover:font-bold">
                        {game.playerB?.id !== -1 ? (
                            <Link to={'/dashboard/' + game.playerB?.id}>
                                {game.playerB?.nickname} (
                                {game.playerB?.eloStart})
                            </Link>
                        ) : (
                            game.playerB?.nickname
                        )}
                    </span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">
                        {game.playerA?.score}/{game.playerB?.score} in{' '}
                        {game.duration > 60
                            ? Math.trunc(game.duration / 60) +
                              'm' +
                              (game.duration % 60) +
                              's'
                            : (game.duration > 0 ? game.duration : 0) + 's'}
                            {game.aborted && ('(game aborted)')}
                    </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="">
                        {game.finished === true ? ('Game played on') : ('Game in play on')}
                        {' '}
                        {format(new Date(game.date), 'MMM d, yyyy')}
                    </span>
                </p>
            </div>
        </div>
    );
}

function NoUser() {
    const { idUserToView } = useParams();
    return (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <h2 className="text-3xl font-extrabold dark:text-white">
                            No user found
                        </h2>
                        <p className="mt-4 mb-4">
                            '{idUserToView}' cannot be found on our server.
                        </p>
                    </article>
                </div>
            </main>
        </>
    );
}
