import { useEffect, useState } from 'react';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
export interface MessageProps {
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

    console.log('user is', user?.id);
    console.log('current chat is', currentChat?.id);

    useEffect(() => {
        let admin = 1;
        let user1 = 4;
        const fetchChannel = async () => {
            console.log('fetching channels for', user?.id, currentChat?.id);
            const response = await authAxios.get(
                'http://localhost:3333/chat/getChannelByUsers',
                {
                    params: { idAdmin: admin, idUser: currentChat?.id },
                    withCredentials: true,
                },
            );
            console.log('fetching channel response' + response);
            if (response.data.length === 0) {
                if (user && currentChat) {
                    console.log(
                        'creating channel ' + user?.id,
                        currentChat?.id,
                    );
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
            } else setChannel(response.data.idChannel);
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

    if (!currentChat) return <div></div>;
    return (
        <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white shadow-2xl overflow-clip h-96"
        >
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                                {channel}
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                Hé, calme-toi ! On est tous dans le même bateau
                                ici.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                Mais sérieusement, ce site est plus compliqué
                                qu'une énigme à la Sherlock Holmes.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                                Pas de souci, Sherlock, on va résoudre ce
                                mystère ensemble.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                Et si on ne réussit pas, on peut toujours former
                                un club des "Gros Connards Incompris."
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                                Haha, c'est une idée ! On pourrait avoir des
                                réunions hebdomadaires.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                Et à chaque réunion, on dirait, "Vous allez être
                                ban bientôt, gros connard."
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                                Exactement ! On peut même avoir des badges "Gros
                                Connard Honoraire."
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                Je suis partant, mais seulement si on peut
                                personnaliser nos badges.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                                Bien sûr, tu pourrais avoir "Maître des Gros
                                Mots" sur le tien.
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                Et toi, tu serais le..
                            </span>
                        </div>
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600">
                                "Gros Connard Suprême."
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                    ></img>
                </div>
            </div>
            <div className="chat-message">
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                                Deal ! Maintenant, revenons à ce site
                                mystérieux. 🤔
                            </span>
                        </div>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-2"
                    ></img>
                </div>
            </div>
        </div>
    );
}
