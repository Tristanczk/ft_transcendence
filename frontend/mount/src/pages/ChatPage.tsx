import { useContext, useEffect, useState } from 'react';
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

function ChatPage({
    isChatVisible,
    toggleChatVisibility,
}: {
    isChatVisible: boolean;
    toggleChatVisibility: () => void;
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
    const [channelListSelected, setChannelListSelected] = useState<number>(-1);
    const [zIndexClass, setZIndexClass] = useState('z-0');
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );
    const [channelUsers, setChannelUsers] = useState<UserSimplified[]>([]);
    const [blockedUsers, setBlockedUsers] = useState<number[]>([]);

    useEffect(() => {
        setVisibleSettings(false);
    }, [isChatVisible, currentFriend, currentChannel]);

    const handleClose = () => {
        setTimeout(() => setChannel(0), 500); // Wait for the animation to complete before setting state
    };

    const closeChat = () => {
        setChannelListSelected(-1);
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

    const fetchFriends = async () => {
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/me`,
                { withCredentials: true },
            );
            setFriendsList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchChannels = async () => {
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
        }
    };

    const fetchMessages = async () => {
        console.log('fetching messages for', channel);
        const response = await authAxios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getMessages/${channel}`,
            {
                params: { idUser: user?.id },
                withCredentials: true,
            },
        );
        if (!response.data) setMessages([]);
        setMessages(response.data);
    };

    const fetchChannel = async () => {
        const response = await authAxios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/getChannelById`,
            {
                params: { idChannel: channel,
                    idUser: user?.id, },
                withCredentials: true,
            },
        );
        setCurrentChannel(response.data);
    };

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
    }, [channel, currentFriend, channelListSelected]);

    useEffect(() => {
        const messageListener = (message: MessageProps) => {
            console.log('received message', message);
            setMessages((oldMessages) => [...oldMessages, message]);
        };

        socket.on('message', messageListener);

        return () => {
            socket.off('message', messageListener);
        };
    }, [socket]);

    const fetchUsers = async () => {
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

    return (
        <div
            className={`fixed z-10 inset-y-0 right-0 w-100 text-white transform top-28 ${
                isChatVisible
                    ? 'translate-x-0 transition-transform duration-500'
                    : 'translate-x-full transition-transform duration-200'
            }`}
        >
            <div
                className="Chatwindow bg-opacity-90 rounded-3xl flex-col justify-start items-center gap-9 inline-flex"
                style={{ marginRight: '36px' }}
            >
                <div
                    className={`flex-1 p:2 justify-between flex flex-col h-screen rounded-3xl transition-all duration-500 ${
                        channel ? 'w-104' : 'w-60'
                    }`}
                >
                    <ChatListHeader
                        selector={setChannelListSelected}
                        handleClose={closeChat}
                    />
                    {channelListSelected < 0 ? (
                        <div className="flex flex-col h-full"></div>
                    ) : channelListSelected ? (
                        <ChatFriendList
                            friends={friendsList}
                            channel={channel}
                            setChannel={setChannel}
                            setCurrentFriend={setCurrentFriend}
                            // notifications={notifications} int[] of channel ids
                        />
                    ) : (
                        <ChatChannelList
                            channels={channels}
                            setChannel={setChannel}
                            setCurrentFriend={setCurrentFriend}
                            channel={channel}
                            // notifications={notifications} int[] of channel ids
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
    );
}

export default ChatPage;

// const send = (message: MessageProps) => {
// socket?.emit('message', { idSender: message.idSender, idChannel: message.idChannel, message: message.message });
//     const response = authAxios.post(
//         '/chat/sendMessage',
//         {
//             idChannel: message.idChannel,
//             idSender: message.idSender,
//             content: message.message,
//         },
//         { withCredentials: true },
//     );
//     console.log(response);
//     setMessages((oldMessages) => [...oldMessages, message]);
// };
// useEffect(() => {
//     if (socket) {
//         const messageListener = ({
//             idSender,
//             idChannel,
//             message,
//         }: {
//             idSender: number;
//             idChannel: number;
//             message: string;
//         }) => {
//             console.log(idSender);
// const newMessage: MessageProps = {
//     idSender: idSender,
//     idChannel: idChannel,
//     message: message,
//     createdAt: new Date(),
// };

// setMessages((oldMessages) => [...oldMessages, newMessage]);
// console.log('setting oldmessages to message');
//         };

//         socket.on('message', messageListener);

//         return () => {
//             socket.off('message', messageListener);
//         };
//     }
// }, [socket]);
