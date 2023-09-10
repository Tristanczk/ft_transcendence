import { useEffect, useState, useRef } from 'react';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import { UserSimplified } from '../../types';
import ChatChannelListElement from './ChatChannelListElement';
import { ChannelProps } from './Messages';

export default function ChatChannelList({
    channels,
    chatSelector,
    setCurrentFriend,
    channel,
}: {
    channels: ChannelProps[] | null;
    chatSelector: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified | null) => void;
    channel: number;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [passwordPrompt, setPasswordPrompt] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const blurTimeout = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    

    const handleBlur = () => {
        blurTimeout.current = setTimeout(() => {
            setShowInput(false);
        }, 100) as any;
    };

    const handleFocus = () => {
        if (blurTimeout.current !== null) clearTimeout(blurTimeout.current);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowInput(true);
        inputRef.current?.focus();
    };

    const createChannel = async () => {
        console.log('creating channel');
        try {
            const response = await authAxios.post(
                'http://localhost:3333/chat/createChannel',
                {
                    idUser: [user?.id],
                    name: 'Les BG',
                    isPublic: true,
                    password: '',
                },
                { withCredentials: true },
            );
            console.log('Channel created', response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setPasswordPrompt(false);
    }, [channel]);

    return (
        <>
            <div
                id="list"
                className={`flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip shadow-xl transition-all duration-500 ${
                    channel ? 'rounded-b-3xl' : 'rounded-none'}`}
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
                                setCurrentFriend={setCurrentFriend}
                                setPasswordPrompt={setPasswordPrompt}
                            />
                        ))}
                </div>
            </div>

            <div className={`px-4 py-2 mb-2 sm:mb-0 flex items-center justify-between rounded-bl-3xl rounded-br-3xl bg-slate-200 shadow-md relative duration-500 ${!channel ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'}`}>
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

//   {passwordPrompt && <h1>Batard</h1>}
