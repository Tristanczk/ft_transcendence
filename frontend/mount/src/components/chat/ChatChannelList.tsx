import { useEffect, useState, useRef } from 'react';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import ChatChannelListElement from './ChatChannelListElement';
import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
import { Alert } from './Alert';

export default function ChatChannelList({
    channels,
    setChannel,
    setCurrentFriend,
    channel,
    notifications,
    setNotifications,
}: {
    channels: ChannelProps[] | null;
    setChannel: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified | null) => void;
    channel: number;
    notifications: number[];
    setNotifications: (notifications: number[]) => void;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [showInput, setShowInput] = useState(false);
    const blurTimeout = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [barHidden, setBarHidden] = useState(false);
    const [input, setInput] = useState('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const closeAlert = () => {
        setAlertMessage(null);
    };

    const handleBlur = () => {
        blurTimeout.current = setTimeout(() => {
            setShowInput(false);
        }, 100) as any;
    };

    const handleFocus = () => {
        if (blurTimeout.current !== null) clearTimeout(blurTimeout.current);
        setBarHidden(false);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowInput(true);
        inputRef.current?.focus();
    };

    useEffect(() => {
        setBarHidden(false); // resetting barHidden on channel change
    }, [channel]);

    const createChannel = async (input: string) => {
        console.log('creating channel');
        try {
            const response = await authAxios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/createChannel`,
                {
                    idUser: [user?.id],
                    name: input,
                    isPublic: true,
                    password: '',
                },
                { withCredentials: true },
            );
            console.log('Channel created', response);
            setChannel(response.data.id);
        } catch (error) {
            console.error(error);
            setAlertMessage('Failed to create the channel. Please try again.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (input.length < 2) return;
            e.preventDefault();
            createChannel(input);
            setShowInput(false);
            setChannel(0);
            setInput('');
        }
    };

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div
                id="list"
                className={`flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip shadow-xl transition-all duration-500 ${
                    channel ? 'rounded-b-3xl' : 'rounded-none'
                }`}
            >
                <div
                    className={`flex flex-col z-10 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip transition-all duration-500 ${
                        channel ? 'h-36' : 'h-96'
                    }`}
                >
                    {channels &&
                        channels
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((channel) => (
                                <ChatChannelListElement
                                    key={channel.id}
                                    channel={channel}
                                    setChannel={setChannel}
                                    setCurrentFriend={setCurrentFriend}
                                    notifications={notifications}
                                    setNotifications={setNotifications}
                                />
                            ))}
                </div>
            </div>

            <div
                className={`px-4 py-2 mb-2 sm:mb-0 flex items-center justify-between rounded-bl-3xl rounded-br-3xl bg-slate-200 shadow-md relative duration-500 ${
                    !channel && !barHidden
                        ? 'transform translate-y-0 opacity-100'
                        : 'transform -translate-y-full opacity-0'
                }`}
            >
                <div
                    className={`flex items-center space-x-2 ${
                        showInput ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                    }`}
                >
                    <button
                        onClick={handleButtonClick}
                        type="button"
                        className="inline-flex items-center justify-center rounded-3xl h-8 w-8 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-amber-300"
                    >
                        <svg
                            className="w-5 h-5 rotate-[45deg]"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Channel name..?"
                    className={`focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-white rounded-3xl border-white transition-all transform ease-in-out duration-500 h-8 overflow-hidden ${
                        showInput ? 'opacity-100 w-full' : 'opacity-0 w-0'
                    }`}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
            </div>
        </>
    );
}
