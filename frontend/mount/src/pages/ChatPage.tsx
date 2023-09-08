import React, { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import {
    WebsocketContext,
    socket as constSocket,
} from '../context/WebsocketContext';
import { Button } from 'flowbite-react';
import { useAuthAxios } from '../context/AuthAxiosContext';
import ListGroupWithButton from '../components/chatpage/ListGroup';
import { UserSimplified } from '../types';
import { SelectChannel } from '../components/chatpage/SelectChannel';
import { useUserContext } from '../context/UserContext';
import { ChatSelector } from '../components/figma_chatpage/ChatSelector';
import { Chat } from '../components/figma_chatpage/Chat';
import Messages, { MessageProps } from '../components/chat/Messages';
import MessagesHeader from '../components/chat/MessagesHeader';
import ChatFriendList from '../components/chat/ChatFriendList';
import ChatListHeader from '../components/chat/ChatListHeader';
import MessageInput from '../components/chat/MessageInput';
import { AxiosResponse } from 'axios';

function ChatPage({ isChatVisible }: { isChatVisible: boolean }) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    let [channel, setChannel] = useState<number>(0);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [currentChat, setCurrentChat] = useState<UserSimplified | null>(null); // or channel
    const [isVisible, setIsVisible] = useState(false);
    const socket = useContext(WebsocketContext);

    const [animateOut, setAnimateOut] = useState(false);

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

        const fetchChannel = async () => {
            console.log('fetching channels for', user?.id, currentChat?.id);
            const response = await authAxios.get(
                'http://localhost:3333/chat/getChannelByUsers',
                {
                    params: { idAdmin: user?.id, idUser: currentChat?.id },
                    withCredentials: true,
                },
            );
            console.log('fetching channel response', response);
            if (response.data.length === 0) {
                if (user && currentChat) {
                    console.log('creating channel', user?.id, currentChat?.id);
                    const response = await authAxios.post(
                        '/chat/createChannel',
                        {
                            idUser: [user?.id, currentChat?.id],
                            name: 'Private message',
                            isPublic: false,
                        },
                        { withCredentials: true },
                    );
                }
                setChannel(response.data.idChannel);
            } else {
                setChannel(response.data.idChannel);
            }
        };
        console.log('channel: ', channel);
        fetchChannel();

        const fetchMessages = async () => {
            console.log('fetching messages for', channel);
            if (!currentChat) return;
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
    }, [currentChat, channel, socket]);

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
                        channel ? 'h-60 w-104' : 'w-60 h-96'
                    }`}
                >
                    <ChatListHeader />
                    <ChatFriendList
                        friends={friendsList}
                        chatSelector={setCurrentChat}
                        currentChat={currentChat}
                        // notifications={notifications} int[] of channel ids
                    />
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
                        <MessagesHeader
                            currentChat={currentChat}
                            handleClose={handleClose}
                        />
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
