import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import { MessageProps } from '../components/chatpage/Message';
import { MessageInput } from '../components/chatpage/MessageInput';
import { socket as constSocket } from '../context/WebsocketContext';
import { Button, ListGroup } from 'flowbite-react';
import { useAuthAxios } from '../context/AuthAxiosContext';
import ListGroupWithButton from '../components/chatpage/ListGroup';
import { UserSimplified } from '../types';
import { SelectChannel } from '../components/chatpage/SelectChannel';
import { useUserContext } from '../context/UserContext';

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

        // const fetchMessages = async () => {
        //     if (currentChannel === 0) return;
        //     const response = await authAxios.get(
        //         `http://localhost:3333/chat/getMessages/${currentChannel}`,
        //         {
        //             params: { idUser: user?.id },
        //             withCredentials: true,
        //         },
        //     );
        //     setMessages(response.data);
        // };
        // fetchMessages();
    }, [currentChannel]);

    console.log(messages);
    return (
        <div className="ChatPage">
            <section className="chatbox">
                <SelectChannel
                    setCurrentChannel={setCurrentChannel}
                    channels={channels}
                />
                <ListGroupWithButton users={friendsList} />
                <Button text="miao" type="button" onClick={onCreateChannel} />
                <ChatWindow channel={currentChannel} messages={messages} />
                <MessageInput channel={currentChannel} send={send} />
            </section>
        </div>
    );
}

export default ChatPage;
