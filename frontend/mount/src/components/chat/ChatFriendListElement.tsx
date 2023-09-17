import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import { useUserContext } from '../../context/UserContext';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useEffect, useState } from 'react';
import { Alert } from './Alert';
import '../../css/index.css';

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
    const [channelId, setChannelId] = useState<number>(0);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const closeAlert = () => {
        setAlertMessage(null);
    };

    const fetchChannelData = async (
        IdFriend: number,
        onlySetChannelId = false,
    ) => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannelByUsers`,
                {
                    params: { idAdmin: user?.id, idUser: IdFriend },
                    withCredentials: true,
                },
            );

            setChannelId(response.data.id);

            if (!onlySetChannelId) {
                setChannel(response.data.id);
                setNotifications(
                    notifications.filter((id) => id !== response.data.id),
                );
                setCurrentFriend(friend);
            }
        } catch (error) {
            console.error('Error fetching channel data:', error);
            setAlertMessage('Error fetching channel data');
        }
    };

    useEffect(() => {
        fetchChannelData(friend.id, true);
    }, [notifications, friend.id]);

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div className="friend-container">
                <div className="flex items-center">
                    <ImageFriend
                        userId={friend.id}
                        textImg={friend.nickname}
                        size={7}
                    />
                    <div className="friend-name">
                        <Link to={'/dashboard/' + friend.id}>
                            {friend.nickname}
                        </Link>
                    </div>
                </div>

                {notifications && notifications.includes(channelId) && (
                    <div className="notification-dot"></div>
                )}
                <button
                    onClick={() => {
                        fetchChannelData(friend.id);
                    }}
                >
                    {' '}
                    <svg
                        className="text-blue-600 w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
        </>
    );
}
