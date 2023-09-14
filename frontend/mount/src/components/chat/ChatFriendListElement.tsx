import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import { useUserContext } from '../../context/UserContext';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useEffect, useState } from 'react';

export default function ChatFriendListElement({
    friend,
    setChannel,
    setCurrentFriend,
    notifications,
    setNotifications,
}: {
    friend: UserSimplified;
    setChannel: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified) => void;
    notifications: number[];
    setNotifications: (notifications: number[]) => void;
}) {
    const { user } = useUserContext();
    const authAxios = useAuthAxios();
    const [channel, setChannelState] = useState<number>(0);

    const fetchChannel = async (IdFriend: number) => {
        console.log('fetching channels for', user?.id, IdFriend);
        const response = await authAxios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannelByUsers`,
            {
                params: { idAdmin: user?.id, idUser: IdFriend },
                withCredentials: true,
            },
        );
        console.log('fetching channel response', response);
        setNotifications(notifications.filter((id) => id !== response.data.id));
        setChannelState(response.data.id);
        setChannel(response.data.id);
        setCurrentFriend(friend);
    };

    return (
        <div className="p-1 px-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
            <div className="flex items-center">
                <ImageFriend
                    userId={friend.id}
                    textImg={friend.nickname}
                    size={7}
                />
                <div className="ml-2 flex flex-col">
                    <div className="leading-snug text-sm text-gray-900 font-medium">
                        <Link to={'/dashboard/' + friend.id}>
                            {friend.nickname}
                        </Link>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    fetchChannel(friend.id);
                }}
            >
                {' '}
                {notifications.includes(channel) && (
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
                    {' '}
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
