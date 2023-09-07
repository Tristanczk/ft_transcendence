import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';

export default function MessagesHeader({
    currentChat,
    setCurrentChat,
}: {
    currentChat: UserSimplified | null;
    setCurrentChat: (friend: UserSimplified | null) => void;
}) {
    if (!currentChat) return <div></div>;
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
                                fill={currentChat.isConnected ? '#4ade80' : '#f43f5e'}
                            ></circle>
                        </svg>
                    </span>
                    <ImageFriend
                        userId={currentChat.id}
                        textImg={currentChat.nickname}
                        customClassName="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                    />
                </div>
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span className="text-gray-700 mr-3">
                            {currentChat.nickname}
                        </span>
                    </div>
                    <span className="text-lg text-gray-600">
                        🏆 {currentChat.elo} ELO
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Link to={'/dashboard/' + currentChat.id}>
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
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                        </svg>
                    </button>
                </Link>
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-slate-500 hover:text-white"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setCurrentChat(null);
                    }}
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
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
