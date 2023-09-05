import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import Message, { MessageProps } from '../components/chatpage/Message';
import { socket as constSocket } from '../context/WebsocketContext';
import { Button } from 'flowbite-react';
import { useAuthAxios } from '../context/AuthAxiosContext';
import ListGroupWithButton from '../components/chatpage/ListGroup';
import { UserSimplified } from '../types';
import { SelectChannel } from '../components/chatpage/SelectChannel';
import { useUserContext } from '../context/UserContext';
import { ChatSelector } from '../components/figma_chatpage/ChatSelector';
import { Chat } from '../components/figma_chatpage/Chat';
import Messages from '../components/chat/Messages';
import MessagesHeader from '../components/chat/MessagesHeader';
import ChatFriendList from '../components/chat/ChatFriendList';
import ChatListHeader from '../components/chat/ChatListHeader';
import MessageInput from '../components/chat/MessageInput';

function ChatPage() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [messages, setMessages] = useState<ChatWindowProps['messages']>([]);
    const [channels, setChannels] = useState<number>(0);
    const [currentChannel, setCurrentChannel] = useState<number>(0);
    const authAxios = useAuthAxios();
    const { user } = useUserContext();

    const send = (message: MessageProps) => {
        // socket?.emit('message', { idSender: message.idSender, idChannel: message.idChannel, message: message.message });
        const response = authAxios.post(
            '/chat/sendMessage',
            {
                idChannel: message.idChannel,
                idSender: message.idSender,
                content: message.message,
            },
            { withCredentials: true },
        );
        console.log(response);
        setMessages((oldMessages) => [...oldMessages, message]);
    };

    useEffect(() => {
        setSocket(constSocket);
    }, []);

    useEffect(() => {
        if (socket) {
            const messageListener = ({
                idSender,
                idChannel,
                message,
            }: {
                idSender: number;
                idChannel: number;
                message: string;
            }) => {
                console.log(idSender);
                const newMessage: MessageProps = {
                    idSender: idSender,
                    idChannel: idChannel,
                    message: message,
                };

                setMessages((oldMessages) => [...oldMessages, newMessage]);
                console.log('setting oldmessages to message');
            };

            socket.on('message', messageListener);

            return () => {
                socket.off('message', messageListener);
            };
        }
    }, [socket]);

    const onCreateChannel = async (event: any) => {
        event.preventDefault();

        if (user) {
            const reponse = await authAxios.post(
                '/chat/createChannel',
                {
                    idUser: user.id,
                    name: 'miao',
                    isPublic: false,
                },
                { withCredentials: true },
            );
            setChannels((oldChannels) => oldChannels + 1);
        }
    };

    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );

    const getMyFriends = async () => {
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

    useEffect(() => {
        const fetchFriends = async () => {
            getMyFriends();
        };
        fetchFriends();
        
        try {
            const fetchChannel = async () => {
                if (currentChannel === 0) return;
                const response = await authAxios.get(
                    `http://localhost:3333/chat/getChannels`,
                    {
                        params: { idUser: user?.id },
                        withCredentials: true,
                    },
                );

                setChannels(response.data.length);
            };
            fetchChannel();
        } catch (error) {
            console.error(error);
        }
        const fetchMessages = async () => {
            if (currentChannel === 0) return;
            const response = await authAxios.get(
                `http://localhost:3333/chat/getMessages/${currentChannel}`,
                {
                    params: { idUser: user?.id },
                    withCredentials: true,
                },
            );
            if (!response.data)
                setMessages([]);
            console.log(response.data);
            setMessages(response.data);
        };
        
        fetchMessages();
    }, [currentChannel]);

    console.log(messages);
    // return (
    //     <div className="w-96 h-56 rounded-3xl flex-col justify-start items-start gap-2.5 inline-flex">
    //         <ChatSelector friends={friendsList} />
    //         <Chat currentChannel={currentChannel} messages={messages} />
    //     </div>
    // );

    const [currentChat, setCurrentChat] = useState<UserSimplified | null >(null);// or channel

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleVisibility}
            >
                Toggle
            </button>
            <div className={`fixed inset-y-0 right-0 w-100 text-white pt-24 transform ${isVisible ? 'translate-x-0 transition-transform duration-500'
                : 'translate-x-full transition-transform duration-200'
                }`}
            >

                <div className="Chatwindow bg-opacity-90 rounded-3xl flex-col justify-start items-center gap-9 inline-flex" style={{ marginRight: "36px" }}>
                    <div className="flex-1 p:2 justify-between flex flex-col h-screen rounded-3xl">
                        <ChatListHeader />
                        <ChatFriendList friends={friendsList} chatSelector={setCurrentChat}/>
                        <MessagesHeader currentChat={currentChat}/>
                        <Messages />
                        <MessageInput />
                    </div>
                </div>
            </div>




        </div>
    );
}

export default ChatPage;
