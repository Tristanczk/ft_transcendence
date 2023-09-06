import { useEffect, useState } from 'react';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import ImageFriend from '../dashboard/friends/ImgFriend';

export interface MessageProps {
    id: number;
    idSender: number;
    idChannel: number;
    message: string;
    createdAt: Date;
}

export default function Messages({
    currentChat,
}: {
    currentChat: UserSimplified | null;
}) {
    const { user } = useUserContext();
    const authAxios = useAuthAxios();
    let [channel, setChannel] = useState<number>(0);
    const [messages, setMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
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
                    const createChannel = async () => {
                        const response = await authAxios.post(
                            '/chat/createChannel',
                            {
                                idUser: [user?.id, currentChat?.id],
                                name: 'Private message',
                                isPublic: false,
                            },
                            { withCredentials: true },
                        );
                    };
                    createChannel();
                    setChannel(response.data.idChannel);
                }
            } else {
                setChannel(response.data.idChannel);
            }
        };
        fetchChannel();

        const fetchMessages = async () => {
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
    }, [currentChat]);

    const [letMessageSender, setLetMessageSender] = useState<number>(0);
    const messageSelector = (messages: MessageProps[]) => {
        for (let i = 0; i < messages.length; i++) {
            let messageGroup: MessageProps[] = [];
            if (messages[i].idSender === user?.id) {
                setLetMessageSender(1);
            } else {
                setLetMessageSender(0);
            }
        }
    };

    if (!currentChat) return <div></div>;
    function groupMessagesBySender(messages: MessageProps[]) {
        let groupedMessages: any = [];
        let currentGroup: any = null;

        messages.forEach((message) => {
            if (currentGroup && currentGroup.idSender === message.idSender) {
                currentGroup.messages.push(message);
            } else {
                if (currentGroup) {
                    groupedMessages.push(currentGroup);
                }
                currentGroup = {
                    idSender: message.idSender,
                    messages: [message],
                };
            }
        });

        if (currentGroup) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    }

    const groupedMessages = groupMessagesBySender(messages);

    return (
        <div  id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white shadow-2xl overflow-clip h-96">
            {groupedMessages.map((group: any, groupIndex: any) => {
                const isCurrentUser = group.idSender === user?.id;

                return (
                    <div className="chat-message" key={groupIndex}>
                        <div
                            className={`flex items-end ${
                                isCurrentUser ? 'justify-end' : ''
                            }`}
                        >
                            <div
                                className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${
                                    isCurrentUser
                                        ? 'order-1 items-end'
                                        : 'order-2 items-start'
                                }`}
                            >
                                {group.messages.map(
                                    (message: any, index: any) => (
                                        <div key={index}>
                                            <span
                                                className={`${
                                                    isCurrentUser
                                                        ? 'rounded-br-none bg-blue-600 text-white'
                                                        : 'rounded-bl-none bg-gray-300 text-gray-600'
                                                } px-4 py-2 rounded-lg inline-block`}
                                            >
                                                {message.message}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                            {isCurrentUser ? (
                                <ImageFriend
                                    customClassName={`w-6 h-6 rounded-full ${
                                        isCurrentUser ? 'order-2' : 'order-1'
                                    }`}
                                    userId={currentChat.id}
                                    textImg={currentChat.nickname}
                                    size={16}
                                />
                            ) : (
                                <ImageFriend
                                    customClassName={`w-6 h-6 rounded-full ${
                                        isCurrentUser ? 'order-2' : 'order-1'
                                    }`}
                                    userId={currentChat.id}
                                    textImg={currentChat.nickname}
                                    size={16}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
