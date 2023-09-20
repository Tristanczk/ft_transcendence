import { useCallback, useContext, useEffect, useState } from 'react';
import { useAuthAxios } from '../context/AuthAxiosContext';
import { UserSimplified } from '../types';
import { useUserContext } from '../context/UserContext';
import Messages, {
    ChannelProps,
    MessageProps,
} from '../components/chat/Messages';
import MessagesHeader from '../components/chat/MessagesHeader';
import ChatListHeader from '../components/chat/ChatListHeader';
import MessageInput from '../components/chat/MessageInput';
import ChatFriendList from '../components/chat/ChatFriendList';
import ChatChannelList from '../components/chat/ChatChannelList';
import ChannelHeader from '../components/chat/ChannelHeader';
import { WebsocketContext } from '../context/WebsocketContext';
import { Alert } from '../components/chat/Alert';
import { GameMode } from '../shared/misc';
import { useNavigate } from 'react-router-dom';

type JoinFriendGameType = {
    mode: GameMode;
    userId: number;
    gameId: string | null;
    friendId: number | null;
};

function ChatPage({
    isChatVisible,
    toggleChatVisibility,
    setIsChatVisible,
    setGameId,
}: {
    isChatVisible: boolean;
    toggleChatVisibility: () => void;
    setIsChatVisible: (value: boolean) => void;
    setGameId: (gameId: string | undefined) => void;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [channel, setChannel] = useState<number>(0);
    const [channels, setChannels] = useState<ChannelProps[]>([]);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [currentFriend, setCurrentFriend] = useState<UserSimplified | null>(
        null,
    );
    const [currentChannel, setCurrentChannel] = useState<ChannelProps | null>(
        null,
    );
    const [visibleSettings, setVisibleSettings] = useState(false);
    const socket = useContext(WebsocketContext);
    const [channelListSelected, setChannelListSelected] = useState<number>(1);
    const [zIndexClass, setZIndexClass] = useState('z-0');
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );
    const [channelUsers, setChannelUsers] = useState<UserSimplified[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
    const [notifications, setNotifications] = useState<number[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const closeAlert = () => {
        setAlertMessage(null);
    };

    useEffect(() => {
        setVisibleSettings(false);
    }, [isChatVisible, currentFriend, currentChannel]);

    const handleClose = () => {
        setTimeout(() => setChannel(0), 500); // Wait for the animation to complete before setting state
    };

    const closeChat = () => {
        setChannelListSelected(1);
        setTimeout(() => setChannel(0), 500);
        toggleChatVisibility();
    };

    useEffect(() => {
        if (visibleSettings) {
            // If settings are becoming visible, we delay the change of z-index.
            const timer = setTimeout(() => {
                setZIndexClass('z-auto');
            }, 500);

            return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or if visibleSettings changes again before the timer fires.
        } else {
            // If settings are hiding, immediately reset z-index.
            setZIndexClass('z-0');
        }
    }, [visibleSettings]);

    const fetchFriends = useCallback(async () => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/me`,
                { withCredentials: true },
            );
            setFriendsList(response.data);
        } catch (error) {
            console.error(error);
            //setAlertMessage('Failed to fetch friends. Please try again.');  it activate on first page load??
        }
    }, [authAxios]);

    const fetchChannels = useCallback(async () => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannels`,
                {
                    withCredentials: true,
                },
            );
            setChannels(response.data);
        } catch (error) {
            console.error(error);
            //setAlertMessage('Failed to fetch channels. Please try again.');
        }
    }, [authAxios]);

    const fetchMessages = useCallback(async () => {
        console.log('fetching messages for', channel);
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getMessages/${channel}`,
                {
                    params: { idUser: user?.id },
                    withCredentials: true,
                },
            );
            if (!response.data) setMessages([]);
            setMessages(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Failed to fetch messages. Please try again.');
        }
    }, [authAxios, channel, user?.id]);

    const fetchChannel = useCallback(async () => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannelById`,
                {
                    params: { idChannel: channel, idUser: user?.id },
                    withCredentials: true,
                },
            );
            setCurrentChannel(response.data);
        } catch (error) {
            console.error(error);
            //setAlertMessage('Failed to fetch channel. Please try again.');
        }
    }, [authAxios, channel, user?.id]);

    const settingEnabler = () => {
        setVisibleSettings(!visibleSettings);
    };

    useEffect(() => {
        fetchFriends();
        fetchChannels();
        if (channel) fetchMessages();
        else setMessages([]);
        fetchChannel();
        setChannelUsers([]);
    }, [channel, fetchFriends, fetchChannels, fetchMessages, fetchChannel]);

    useEffect(() => {
        const messageListener = (message: MessageProps) => {
            console.log('received message', message);

            if (message.idSender !== user?.id) {
                if (message.idChannel !== channel) {
                    if (!notifications.includes(message.idChannel)) {
                        setNotifications((oldNotifications) => [
                            ...oldNotifications,
                            message.idChannel,
                        ]);
                    }
                }
            }

            if (message.idChannel === channel)
                setMessages((oldMessages) => [...oldMessages, message]);
        };

        socket.on('message', messageListener);
        socket.on('ban', () => setChannel(0));
        socket.on('reloadfriends', () => fetchFriends());
        socket.on('reloadchannels', () => fetchChannels());
        socket.on('reloadchannel', (channelId) => {
            console.log(channelId + '  ' + channel);
            if (channelId === channel) fetchChannel();
        });
        socket.on('signoutchat', () => {
            setChannel(0);
            setChannelListSelected(1);
            closeChat();
            setIsChatVisible(false);
        });

        return () => {
            socket.off('message', messageListener);
        };
    }, [socket, fetchFriends, notifications, user?.id, channel]);

    const fetchUsers = async () => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannelUsers`,
                {
                    params: { idChannel: currentChannel?.id, idUser: user?.id },
                    withCredentials: true,
                },
            );
            console.log('fetchUsers');
            console.log(response.data);

            setChannelUsers(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Failed to fetch users. Please try again.');
        }
    };

    const handleBlock = async () => {
        if (!currentFriend) return;
        if (blockedUsers.includes(currentFriend?.id)) {
            setBlockedUsers((oldBlockedUsers) =>
                oldBlockedUsers.filter((id) => id !== currentFriend?.id),
            );
        } else {
            setBlockedUsers((oldBlockedUsers) => [
                ...oldBlockedUsers,
                currentFriend?.id,
            ]);
        }
    };

    const handleGameInvite = async () => {
        if (!currentFriend || !user) return; //TO DO display an error message impossible to send game invite
        const joinFriendGame: JoinFriendGameType = {
            mode: 'classic',
            userId: user.id,
            gameId: null,
            friendId: currentFriend.id,
        }; // TODO: add mode selection
        socket.emit('joinFriendGame', joinFriendGame, (response: any) => {
            if (response.error) {
                //TO DO : display an error message equal to response.error
                if (response.errorCode === 'alreadyInGame') {
                    setGameId(response.gameId);
                }
            } else {
                setGameId(response.gameId);
                setGameId('waiting_' + response.gameId);
                toggleChatVisibility();
                navigate('/waiting');
            }
        });
    };

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div
                className={`fixed z-10 inset-y-0 right-0 w-100 text-white transform top-24 ${
                    isChatVisible
                        ? 'translate-x-0 transition-transform duration-500 ease-in-out'
                        : 'translate-x-full transition-transform duration-200 ease-in-out'
                }`}
            >
                <div
                    className="Chatwindow bg-opacity-90 rounded-3xl flex-col justify-start items-center gap-9 inline-flex"
                    style={{ marginRight: '36px' }}
                >
                    <div
                        className={`flex-1 p:2 justify-between flex flex-col h-screen rounded-3xl transition-all duration-500 ${
                            channel ? 'w-104' : 'w-80'
                        }`}
                    >
                        <ChatListHeader
                            selector={setChannelListSelected}
                            handleClose={closeChat}
                            channelListSelected={channelListSelected}
                        />
                        {channelListSelected < 0 ? (
                            <div className="flex flex-col h-full"></div>
                        ) : channelListSelected ? (
                            <ChatFriendList
                                friends={friendsList}
                                channel={channel}
                                setChannel={setChannel}
                                setCurrentFriend={setCurrentFriend}
                                notifications={notifications}
                                setNotifications={setNotifications}
                                setIsChatVisible={setIsChatVisible}
                            />
                        ) : (
                            <ChatChannelList
                                channels={channels}
                                setChannel={setChannel}
                                setCurrentFriend={setCurrentFriend}
                                channel={channel}
                                notifications={notifications}
                                setNotifications={setNotifications}
                            />
                        )}
                        <div
                            className={`chat-content
                                ${
                                    channel
                                        ? 'opacity-100 delay-0'
                                        : 'opacity-0 delay-500'
                                }
                                    ${
                                        channel
                                            ? 'visible delay-500'
                                            : 'invisible delay-0'
                                    }
                                    ${channel ? 'h-auto' : 'h-0'}
                                    transition-opacity transition-visibility transition-height duration-500`}
                        >
                            {currentFriend ? (
                                <MessagesHeader
                                    channel={channel}
                                    currentFriend={currentFriend}
                                    handleClose={handleClose}
                                    handleBlock={handleBlock}
                                    handleGameInvite={handleGameInvite}
                                />
                            ) : (
                                <ChannelHeader
                                    channel={channel}
                                    currentChannel={currentChannel}
                                    handleClose={handleClose}
                                    onClick={settingEnabler}
                                />
                            )}
                            <Messages
                                messages={messages}
                                isSettingVisible={visibleSettings}
                                zIndexClass={zIndexClass}
                                currentChannel={currentChannel}
                                handleClose={handleClose}
                                channelUsers={channelUsers}
                                fetchUsers={fetchUsers}
                                blockedUsers={blockedUsers}
                                setChannelUsers={setChannelUsers}
                            />
                            <MessageInput idChannel={channel} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatPage;
