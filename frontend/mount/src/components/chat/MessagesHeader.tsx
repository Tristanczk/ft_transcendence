import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';

export default function MessagesHeader({
    channel,
    currentFriend,
    handleClose,
    handleBlock,
}: {
    channel: number;
    currentFriend: UserSimplified | null;
    handleClose: () => void;
    handleBlock: () => void;
}) {
    if (channel === 0 || !currentFriend) return <div></div>;

    return (
        <div className="flex sm:items-center justify-between py-3 bg-slate-100 px-3 rounded-tl-3xl rounded-tr-3xl shadow-2xl">
            <div className="relative flex items-center space-x-4">
                <div className="relative">
                    <span className="absolute text-green-500 right-0 bottom-0">
                        <svg width="20" height="20">
                            <circle
                                cx="8"
                                cy="8"
                                r="8"
                                fill={
                                    currentFriend.isConnected
                                        ? '#4ade80'
                                        : '#f43f5e'
                                }
                            ></circle>
                        </svg>
                    </span>
                    <ImageFriend
                        userId={currentFriend.id}
                        textImg={currentFriend.nickname}
                        customClassName="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                    />
                </div>
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span className="text-gray-700 mr-3">
                            {currentFriend.nickname}
                        </span>
                    </div>
                    <span className="text-lg text-gray-600">
                        🏆 {currentFriend.elo} ELO
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Link to={'/dashboard/' + currentFriend.id}>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-6 w-6 text-slate-500 hover:text-white"
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
                    className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
                >
                    <svg
                        className="h-6 w-6 text-black"
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
                    className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
                >
                    <svg
                        className="h-6 w-6 text-slate-500 hover:text-white"
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
    );
}
