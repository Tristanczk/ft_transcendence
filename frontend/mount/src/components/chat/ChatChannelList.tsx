import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import ChatChannelListElement from './ChatChannelListElement';
import { ChannelProps } from './Messages';

export default function ChatChannelList({
    channels,
    chatSelector,
    channel
}: {
    channels: ChannelProps[] | null;
    chatSelector: (channel: number) => void;
    channel: number;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();

    const createChannel = async () => {
        console.log('creating channel');
        try {
            const response = await authAxios.post(
                'http://localhost:3333/chat/createChannel',
                {
                    idUser: [user?.id],
                    name: 'Your Channel Name',
                    isPublic: true,
                    password: 'YourPassword',
                },
                { withCredentials: true },
            );
            console.log('Channel created', response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            id="list"
            className="flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip rounded-br-3xl rounded-bl-3xl mb-6 shadow-xl"
        >
            <div
                className={`flex flex-col overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip transition-all duration-500 ${
                    channel ? 'h-36' : 'h-96'
                }`}
            >
                {channels &&
                    channels.map((channel) => (
                        <ChatChannelListElement
                            key={channel.id}
                            channel={channel}
                            chatSelector={chatSelector}
                        />
                    ))}
                <button className="p-1 px-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
                    <div className="flex items-center">
                        <div className="ml-2 flex flex-col">
                            <div className="leading-snug text-sm text-gray-900 font-medium">
                                <span
                                    onClick={() => createChannel()}
                                    className="text-gray-700 mr-3"
                                >
                                    Create a channel
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
