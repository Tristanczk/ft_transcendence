import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import ShowIsOnline from '../dashboard/friends/ShowIsOnline';
import { useState } from 'react';
import { GameModeAlert } from './GameModeAlert';

export default function MessagesHeader({
    channel,
    currentFriend,
    handleClose,
    handleBlock,
    handleGameInvite,
}: {
    channel: number;
    currentFriend: UserSimplified | null;
    handleClose: () => void;
    handleBlock: () => void;
    handleGameInvite: (mode: 'classic' | 'mayhem' | 'battle', idUser: number) => void;
}) {
    const [alert, setAlert] = useState<boolean>(false);

    const onClose = () => {
        setAlert(false);
    };

    if (channel === 0 || !currentFriend) return <div></div>;

    return (
        <>
            {alert && (
                <GameModeAlert
                    onClose={onClose}
                    handleClick={handleGameInvite}
                    friendClicked={currentFriend.id}
                />
            )}
            <div className="flex sm:items-center justify-between py-3 bg-slate-100 px-3 rounded-none sm:rounded-tl-3xl sm:rounded-tr-3xl shadow-2xl">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <span className="absolute text-green-500 right-0 bottom-0">
                            <ShowIsOnline
                                userId={currentFriend.id}
                                initStatus={currentFriend.isConnected}
                                playingStatus={currentFriend.isPlaying}
                                text={false}
                            />
                        </span>
                        <ImageFriend
                            userId={currentFriend.id}
                            textImg={currentFriend.nickname}
                            customClassName="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-2xl mt-1 flex items-center">
                            <Link to={'/dashboard/' + currentFriend.id}>
                                <button className="group inline-block hover:text-blue-600 text-gray-600 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-blue-600 mr-3">
                                    {currentFriend.nickname}
                                </button>
                            </Link>
                        </div>
                        <Link to={'/leaderboard/'}>
                            <button className="group inline-block hover:text-blue-600 text-gray-600 text-xs sm:text-md md:text-xl transition-transform duration-300 ease-in-out hover:scale-105 hover:text-blue-600 mr-3">
                                🏆 {currentFriend.elo} ELO
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setAlert(true)}
                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 md:h-10 md:w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-amber-400 hover:scale-110"
                    >
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-4 w-4 sm:w-6 sm:w-6 text-slate-500 hover:text-white"
                        >
                            <path d="M17.457 3L21 3.003l.002 3.523-5.467 5.466 2.828 2.829 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415-2.829-2.828-2.828 2.828 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 2.827-2.828-5.46-5.46L3 3l3.546.003 5.453 5.454L17.457 3zm-7.58 10.406L7.05 16.234l.708.707 2.827-2.828-.707-.707zm9.124-8.405h-.717l-4.87 4.869.706.707 4.881-4.879v-.697zm-14 0v.7l11.241 11.241.707-.707L5.716 5.002l-.715-.001z" />
                        </svg>
                    </button>
                    <Link to={'/dashboard/' + currentFriend.id}>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg h-8 w-8 md:h-10 md:w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500 hover:scale-110"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-4 w-4 sm:w-6 sm:w-6 text-slate-500 hover:text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </button>
                    </Link>
                    <button
                        type="button"
                        onClick={handleBlock}
                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 md:h-10 md:w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500 hover:scale-110"
                    >
                        <svg
                            className="h-4 w-4 sm:w-6 sm:w-6 text-slate-500 hover:text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {' '}
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{' '}
                            <circle cx="8.5" cy="7" r="4" />{' '}
                            <line x1="18" y1="8" x2="23" y2="13" />{' '}
                            <line x1="23" y1="8" x2="18" y2="13" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 md:h-10 md:w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500 hover:scale-110"
                    >
                        <svg
                            className="h-4 w-4 sm:w-6 sm:w-6 text-slate-500 hover:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            {' '}
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
