import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { Alert } from './Alert';

export default function ChatChannelListElement({
    channel,
    setChannel,
    setCurrentFriend,
    notifications,
    setNotifications,
}: {
    channel: ChannelProps;
    setChannel: (channel: number) => void;
    setCurrentFriend: (friend: UserSimplified | null) => void;
    notifications: number[];
    setNotifications: (notifications: number[]) => void;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [activeInput, setActiveInput] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const blurTimeout = useRef<number | null>(null);

    // Focusing the password input when it becomes active
    useEffect(() => {
        if (activeInput === true && passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, [activeInput]);

    // Handler for when input loses focus
    const handleBlur = () => {
        blurTimeout.current = window.setTimeout(() => {
            setActiveInput(false);
            setInput('');
        }, 100);
    };

    // Handler for when input gains focus
    const handleFocus = () => {
        if (blurTimeout.current !== null) clearTimeout(blurTimeout.current);
    };
    const closeAlert = () => {
        setAlertMessage(null);
    };

    const isChannelOpen = async (channel: ChannelProps) => {
        try {
            const isUserBanned = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/isUserBanned`,
                {
                    params: {
                        idChannel: channel.id,
                        idUser: user?.id,
                    },
                    withCredentials: true,
                },
            );

            if (isUserBanned.data === true) {
                setAlertMessage('You are banned from this channel');
                return;
            }

            const isUserInChannel = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/isUserInChannel`,
                {
                    params: {
                        idChannel: channel.id,
                        idUser: user?.id,
                    },
                    withCredentials: true,
                },
            );
            if (isUserInChannel.data === true) {
                setCurrentFriend(null);
                setNotifications(
                    notifications.filter((id) => id !== channel.id),
                );
                setChannel(channel.id);
                return;
            }

            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/isChannelOpen`,
                {
                    params: {
                        idChannel: channel.id,
                        idUser: user?.id,
                    },
                    withCredentials: true,
                },
            );

            if (response.data === true) {
                await authAxios.post(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/joinChannel`,
                    {
                        idUser: user?.id,
                        idChannel: channel.id,
                        password: input,
                    },
                    {
                        withCredentials: true,
                    },
                );
                setCurrentFriend(null);
                setNotifications(
                    notifications.filter((id) => id !== channel.id),
                );
                setChannel(channel.id);
            } else {
                setActiveInput(true);
            }
        } catch (error) {
            console.error(error);
            setAlertMessage('Error joining channel');
        }
    };

    const onKeyPress = async () => {
        try {
            const response = await authAxios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/joinChannel`,
                {
                    idUser: user?.id,
                    idChannel: channel.id,
                    password: input,
                },
                {
                    withCredentials: true,
                },
            );

            if (response.data === false) {
                setActiveInput(false);
                setChannel(0);
            } else {
                setActiveInput(false);
                setNotifications(
                    notifications.filter((id) => id !== channel.id),
                );
                setChannel(channel.id);
            }
            setInput('');
            setActiveInput(false);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error joining channel');
        }
    };

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div className="flex items-center justify-between = px-3 py-0.5 md:py-3.5 border-b border-gray-900 transition-all duration-500 hover:bg-gray-700">
                <div className="flex items-center">
                    <div className="ml-2 flex flex-col">
                        <div className="group inline-block hover:scale-110 hover:text-blue-600 text-gray-300 mr-3 transition-transform duration-300 ease-in-out">
                            {' '}
                            <button
                                onClick={() => {
                                    isChannelOpen(channel);
                                }}
                            >
                                {channel.name}
                            </button>
                            {activeInput && (
                                <input
                                    type="password"
                                    className="relative transform text-slate-500 -translate-y z-50 border border-gray-300 bg-gray-800 rounded-md transition-all ease-in-out duration-500 left-0 top-0 right-0"
                                    placeholder="Enter password"
                                    value={input}
                                    ref={passwordInputRef}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                    }}
                                    onBlur={handleBlur}
                                    onFocus={handleFocus}
                                    onKeyDown={(event) =>
                                        event.key === 'Enter' && onKeyPress()
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        isChannelOpen(channel);
                    }}
                >
                    <svg
                        className={
                            notifications && notifications.includes(channel.id)
                                ? 'group inline-block text-rose-600 mr-3 transition-transform duration-300 ease-in-out hover:scale-110 w-6 h-6 hover:scale-110'
                                : 'group inline-block text-blue-600 mr-3 transition-transform duration-300 ease-in-out hover:scale-110 w-6 h-6 hover:scale-110'
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />{' '}
                        <line x1="12" y1="12" x2="12" y2="12.01" />{' '}
                        <line x1="8" y1="12" x2="8" y2="12.01" />{' '}
                        <line x1="16" y1="12" x2="16" y2="12.01" />
                    </svg>
                </button>
            </div>
        </>
    );
}
