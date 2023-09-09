import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
    WebsocketContext,
    socket as constSocket,
} from '../context/WebsocketContext';
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

function ChatPage({ isChatVisible }: { isChatVisible: boolean }) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [channel, setChannel] = useState<number>(0);
    const [channels, setChannels] = useState<ChannelProps[]>([]);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [currentFriend, setCurrentFriend] = useState<UserSimplified | null>(
        null,
    );
    const [currentChat, setCurrentChat] = useState<UserSimplified | null>(null); // or channel
    const [isVisible, setIsVisible] = useState(false);
    const socket = useContext(WebsocketContext);
    const [channelListSelected, setChannelListSelected] = useState<number>(-1);

    const handleClose = () => {
        setIsVisible(false); // Start the fade-out animation
        setTimeout(() => setCurrentChat(null), 500); // Wait for the animation to complete before setting state
    };
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await authAxios.get(
                    'http://localhost:3333/friends/me',
                    { withCredentials: true },
                );
                setFriendsList(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchFriends();

        const fetchChannels = async () => {
            try {
                const response = await authAxios.get(
                    'http://localhost:3333/chat/getChannels',
                    {
                        withCredentials: true,
                    },
                );
                console.log(response.data);
                setChannels(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchChannels();

        const fetchMessages = async () => {
            console.log('fetching messages for', channel);
            const response = await authAxios.get(
                `http://localhost:3333/chat/getMessages/${channel}`,
                {
                    params: { idUser: user?.id },
                    withCredentials: true,
                },
            );
            if (!response.data) setMessages([]);
            console.log(response.data);
            setMessages(response.data);
        };
        if (channel) fetchMessages();
    }, [channel, socket, currentFriend]);

    socket.on('message', (message: MessageProps) => {
        console.log('received message', message);
        //if current channel, else notification => channelid
        setMessages((oldMessages) => [...oldMessages, message]);
    });

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
                    <ChatListHeader selector={setChannelListSelected} />
                    {channelListSelected < 0 ? (
                        <div className="flex flex-col h-full"></div>
                    ) : channelListSelected ? (
                        <ChatFriendList
                            friends={friendsList}
                            channel={channel}
                            chatSelector={setChannel}
                            setCurrentFriend={setCurrentFriend}
                            // notifications={notifications} int[] of channel ids
                        />
                    ) : (
                        <ChatChannelList
                            channels={channels}
                            chatSelector={setChannel}
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
                            />
                        ) : (
                            <div></div>
                        )}
                        <Messages messages={messages} />
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
