import { Link } from 'react-router-dom';
import ImageFriend from '../dashboard/friends/ImgFriend';
import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useState } from 'react';
import { useUserContext } from '../../context/UserContext';

export default function ChatChannelListElement({
    channel,
    setChannel,
    setCurrentFriend,
    notifications,
    setNotifications,
}: {
    channel: ChannelProps;
    setChannel: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified | null) => void;
    notifications: number[];
    setNotifications: (notifications: number[]) => void;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [activeInput, setActiveInput] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');

    const isChannelOpen = async (channel: ChannelProps) => {
        const isUserInChannel = await authAxios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/isUserInChannel`,
            {
                params: {
                    idChannel: channel.id,
                    idUser: user?.id,
                },
                withCredentials: true,
            },
        );
        if (isUserInChannel.data === true) {
            setCurrentFriend(null);
            setNotifications(notifications.filter((id) => id !== channel.id));
            setChannel(channel.id);
            return;
        }

        const response = await authAxios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/isChannelOpen`,
            {
                params: {
                    idChannel: channel.id,
                    idUser: user?.id,
                },
                withCredentials: true,
            },
        );
        if (response.data === true) {
            console.log(isUserInChannel.data);
            const response = await authAxios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/joinChannel`,
                {
                    idUser: user?.id,
                    idChannel: channel.id,
                    password: input,
                },
                {
                    withCredentials: true,
                },
            );
            setCurrentFriend(null);
            setNotifications(notifications.filter((id) => id !== channel.id));
            setChannel(channel.id);
        } else {
            setActiveInput(true);
            console.log('input on');
        }
    };

    const onKeyPress = async () => {
        const response = await authAxios.post(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/joinChannel`,
            {
                idUser: user?.id,
                idChannel: channel.id,
                password: input,
            },
            {
                withCredentials: true,
            },
        );

        if (response.data === false) {
            setActiveInput(false);
            setChannel(0);
        } else {
            setActiveInput(false);
            setNotifications(notifications.filter((id) => id !== channel.id));
            setChannel(channel.id);
        }
        setInput('');
        setActiveInput(false);
    };

    return (
        <div className="p-1 px-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
            <div className="flex items-center">
                <div className="ml-2 flex flex-col">
                    <div className="leading-snug text-sm text-gray-900 font-medium">
                        {activeInput && (
                            <input
                                type="password"
                                className="relative transform text-slate-500 -translate-y left-full z-50 border border-gray-300 bg-white rounded-md transition-all ease-in-out duration-500 left-0 top-0 right-0"
                                placeholder="Enter password"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }}
                                onKeyDown={(event) =>
                                    event.key === 'Enter' && onKeyPress()
                                }
                            />
                        )}
                        <span>{channel.name}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => {
                    isChannelOpen(channel);
                }}
            >
                {' '}
                {notifications.includes(channel.id) && (
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                )}
                <svg
                    className="text-blue-600 w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />{' '}
                    <line x1="12" y1="12" x2="12" y2="12.01" />{' '}
                    <line x1="8" y1="12" x2="8" y2="12.01" />{' '}
                    <line x1="16" y1="12" x2="16" y2="12.01" />
                </svg>
            </button>
        </div>
    );
}
