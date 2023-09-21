import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserSimplified } from '../../types';
import ChatFriendListElement from './ChatFriendListElement';

export default function ChatFriendList({
    friends,
    channel,
    setChannel,
    setCurrentFriend,
    notifications,
    setNotifications,
    setIsChatVisible,
}: {
    friends: UserSimplified[] | null;
    channel: number;
    setChannel: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified) => void;
    notifications: number[];
    setNotifications: (notifications: number[]) => void;
    setIsChatVisible: (state: boolean) => void;
}) {
    const navigate = useNavigate()

    return (
        <>
            <div
                id="list"
                className={`flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-gray-800 overflow-clip shadow-xl ${
                    channel ? 'rounded-b-3xl' : 'rounded-none'
                }`}
            >
                <div
                    className={` flex flex-col overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-gray-800 overflow-clip transition-all duration-500 ${
                        channel ? 'h-24 md:h-36' : 'h-96'
                    }`}
                >
                    {friends &&
                        friends.map((friend) => (
                            <ChatFriendListElement
                                key={friend.id}
                                friend={friend}
                                setChannel={setChannel}
                                setCurrentFriend={setCurrentFriend}
                                notifications={notifications}
                                setNotifications={setNotifications}
                            />
                        ))}
                </div>
            </div>

            <div
                className={`px-4 py-2 mb-[-36px] sm:mb-[-24px] md:mb-[-12px] flex items-center justify-between rounded-bl-3xl rounded-br-3xl bg-gray-900 shadow-md relative duration-500 ${
                    !channel
                        ? 'transform -translate-y-0 opacity-100'
                        : 'transform -translate-y-full opacity-0'
                }`}
            >
                <div
                    className={`flex items-center space-x-2 w-auto'
                    }`}
                >
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-3xl w-6 h-6 md:h-8 md:w-8 transition duration-500 ease-in-out focus:outline-none bg-gray-700 hover:text-gray-300 hover:bg-amber-300 hover:scale-110"
                            onClick={()=>{
                                setIsChatVisible(false);
                                navigate('/dashboard')}}
                        >
                            <svg
                                className="w-5 h-5 rotate-[45deg]"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <p>Add new friends</p>
                </div>
            </div>
        </>
    );
}
