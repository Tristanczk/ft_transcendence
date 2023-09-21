import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import { UserSimplified } from '../../types';
import ChannelUserForm from './ChannelUserForm';
import { ChannelProps } from './Messages';
import { useState, useRef, useEffect } from 'react';
import { Alert } from './Alert';

export default function SettingBar({
    currentChannel,
    handleClose,
    isSettingVisible,
    channelUsers,
    fetchUsers,
    setChannelUsers,
}: {
    currentChannel: ChannelProps | null;
    handleClose: () => void;
    isSettingVisible: boolean;
    channelUsers: UserSimplified[];
    fetchUsers: () => void;
    setChannelUsers: (users: UserSimplified[]) => void;
}) {
    const authAxios = useAuthAxios();
    const { user } = useUserContext();
    const [input, setInput] = useState<string>('');
    const [formState, setFormState] = useState<'kick' | 'ban' | 'admin' | 'mute' | null>(
        null,
    );
    const blurTimeout = useRef<any>(null);
    const [showInput, setShowInput] = useState(false);
    const [showList, setShowList] = useState(false);

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [activeInput, setActiveInput] = useState<'password' | 'name' | null>(
        null,
    );

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const closeAlert = () => {
        setAlertMessage(null);
    };

    // EFFECTS

    const handleBlur = () => {
        blurTimeout.current = setTimeout(() => {
            setInput('');
            setShowInput(false);
            setActiveInput(null);
        }, 100);
    };

    const handleFocus = () => {
        if (blurTimeout.current !== null) clearTimeout(blurTimeout.current);
    };

    const removeInput = () => {
        if (activeInput) {
            setActiveInput(null);
            setInput('');
        }
    };

    // PASSWORD

    useEffect(() => {
        if (showInput && activeInput) {
            if (activeInput === 'password' && passwordInputRef.current) {
                passwordInputRef.current.focus();
            } else if (activeInput === 'name' && nameInputRef.current) {
                nameInputRef.current.focus();
            }
        }
    }, [showInput, activeInput]);

    const handlePasswordClick = () => {
        if (activeInput !== 'password') {
            setActiveInput('password');
            setShowList(false);
            setShowInput(true);
        } else {
            setActiveInput(null);
            setShowInput(false);
        }
    };

    const handleNameClick = () => {
        if (activeInput !== 'name') {
            setActiveInput('name');
            setShowList(false);
            setShowInput(true);
        } else {
            setActiveInput(null);
            setShowInput(false);
        }
    };

    const handleListClick = () => {
        if (showList === false) {
            setShowList(true);
            removeInput();
            fetchUsers();
        } else {
            setShowList(false);
        }
    };

    const isPasswordActive = activeInput === 'password';
    const passwordInputClasses = isPasswordActive
        ? showInput
            ? 'opacity-100 pointer-events-auto w-44'
            : 'opacity-0 pointer-events-none w-0'
        : 'opacity-0 pointer-events-none w-0';

    const isNameActive = activeInput === 'name';
    const nameInputClasses = isNameActive
        ? showInput
            ? 'opacity-100 pointer-events-auto w-44'
            : 'opacity-0 pointer-events-none w-0'
        : 'opacity-0 pointer-events-none w-0';

    const adminListClasses =
        showList === true
            ? 'transition-all ease-in-out duration-500 opacity-100 pointer-events-auto w-44 max-h-64 overflow-y-auto focus:outline-none focus:border-transparent focus:ring focus:ring-amber-500 border-0 absolute top-0 left-24 text-gray-600 bg-slate-100 rounded-3xl z-40'
            : 'transition-all ease-in-out duration-500 opacity-0 pointer-events-none absolute top-0 left-24 w-0 h-0';

    const editPassword = async () => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/editPassword`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                    password: input,
                },
                { withCredentials: true },
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error editing password');
        }
    };

    const editName = async () => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/editName`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                    name: input,
                },
                { withCredentials: true },
            );
        } catch (error) {
            console.error(error);
            setAlertMessage('Error editing name');
        }
    };

    const leaveChannel = async () => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/leaveChannel`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                },
                { withCredentials: true },
            );
            handleClose();
        } catch (error) {
            console.error(error);
            setAlertMessage('Error leaving channel');
        }
    };

    const onKeyPress = ({
        event,
        exec,
    }: {
        event: React.KeyboardEvent<HTMLInputElement>;
        exec: () => void;
    }) => {
        if (
            event.key === 'Enter' &&
            !(activeInput === 'name' && input.length < 3)
        ) {
            if (!event.shiftKey) {
                event.preventDefault();
                exec();
                setInput('');
                setActiveInput(null);
            }
        }
    };

    const handleBanUser = async (idUser: number) => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/banUser`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                    idUser: idUser,
                    isBanned: true,
                },
                { withCredentials: true },
            );
            console.log(response.data);
            if (typeof response.data === 'string')
                setAlertMessage(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error banning user');
        }
    };

    const handleKickUser = async (idUser: number) => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/banUser`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                    idUser: idUser,
                },
                { withCredentials: true },
            );
            console.log(response.data);
            if (typeof response.data === 'string')
                setAlertMessage(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error banning user');
        }
    };

    const handleAddAdmin = async (idUser: number) => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/addAdmin`,
                {
                    id: currentChannel?.id,
                    idRequester: user?.id,
                    idUser: idUser,
                },
                { withCredentials: true },
            );
            if (typeof response.data === 'string')
                setAlertMessage(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error adding admin');
        }
    };

    const handleMuteUser = async (idUser: number) => {
        try {
            const response = await authAxios.patch(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/muteUser`,
                {
                    idChannel: currentChannel?.id,
                    idRequester: user?.id,
                    idUser: idUser,
                    time: new Date().getTime() + 120000, // 2 minute
                },
                { withCredentials: true },
            );
            if (typeof response.data === 'string')
                setAlertMessage(response.data);
        } catch (error) {
            console.error(error);
            setAlertMessage('Error muting user');
        }
    };

    const getClickHandler = () => {
        switch (formState) {
            case 'kick':
                return handleKickUser;
            case 'ban':
                return handleBanUser;
            case 'admin':
                return handleAddAdmin;
            case 'mute':
                return handleMuteUser;
            default:
                return () => {};
        }
    };

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div
                className={`relative flex-col items-center transition-all duration-500 space-y-0 lt:space-y-2 md:space-y-4 bg-gray-200 w-1/6 sm:w-1/6 flex z-0 object-bottom object-fill
                ${
                    isSettingVisible
                        ? 'right-0 sm:right-16 md:right-20 opacity-100'
                        : 'right-0 opacity-0'
                }
                ease-in-out rounded-3xl py-1 sm:py-2 md:py-4`}
            >
                <button
                    name="Password"
                    onClick={handlePasswordClick}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-amber-500"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <circle cx="8" cy="15" r="4" />{' '}
                        <line x1="10.85" y1="12.15" x2="19" y2="4" />{' '}
                        <line x1="18" y1="5" x2="20" y2="7" />{' '}
                        <line x1="15" y1="8" x2="17" y2="10" />
                    </svg>
                </button>
                <input
                    ref={passwordInputRef}
                    value={input}
                    type="password"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(event) =>
                        onKeyPress({ event, exec: editPassword })
                    }
                    placeholder="Enter password"
                    className={`focus:outline-none focus:border-transparent focus:ring focus:ring-amber-500 border-0 absolute top-1 left-24 text-gray-600 bg-slate-100 rounded-3xl transition-all ease-in-out duration-500 py-2 px-4 z-40 overflow-hidden ${passwordInputClasses}`}
                    readOnly={!isPasswordActive || !showInput}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
                <button
                    name="Ban"
                    onClick={() => {
                        setFormState('ban');
                        handleListClick();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-rose-500"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <circle cx="8.5" cy="7" r="4" />{' '}
                        <path d="M2 21v-2a4 4 0 0 1 4 -4h5a4 4 0 0 1 4 4v2" />{' '}
                        <path d="M17 9l4 4m0 -4l-4 4" />
                    </svg>
                </button>
                <button
                    name="Exit"
                    onClick={() => {
                        removeInput();
                        leaveChannel();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-rose-500"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        {' '}
                        <path
                            fillRule="evenodd"
                            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <button
                    name="Name"
                    onClick={() => {
                        handleNameClick();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-amber-300"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {' '}
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
                <input
                    ref={nameInputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    onKeyDown={(event) => onKeyPress({ event, exec: editName })}
                    placeholder="Edit channel name"
                    className={`focus:outline-none focus:border-transparent focus:ring focus:ring-amber-500 border-0 absolute top-44 left-24 text-gray-600 bg-slate-100 rounded-3xl transition-all ease-in-out duration-500 py-2 px-4 z-40 overflow-hidden ${nameInputClasses}`}
                    readOnly={!isNameActive || !showInput}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                />
                <button
                    name="Admin"
                    onClick={() => {
                        setFormState('admin');
                        handleListClick();
                    }}
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-amber-300"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                </button>
                <button
                    name="Mute"
                    type="button"
                    onClick={() => {
                        setFormState('mute');
                        handleListClick();
                    }}
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-green-500"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            clipRule="evenodd"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                    </svg>
                </button>
                <button
                    name="Praise"
                    type="button"
                    onClick={() => {
                        setFormState('ban');
                        handleListClick();
                    }}
                    className="inline-flex items-center justify-center rounded-lg transition-all duration-500 h-8 w-8 md:h-10 md:w-10 ease-in-out focus:outline-none bg-slate-200 bg-gray-200 transform hover:scale-110 hover:bg-green-500"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 md:w-6 sm:h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" />{' '}
                        <line x1="3" y1="21" x2="21" y2="21" />{' '}
                        <path d="M10 21v-4a2 2 0 0 1 4 0v4" />{' '}
                        <line x1="10" y1="5" x2="14" y2="5" />{' '}
                        <line x1="12" y1="3" x2="12" y2="8" />{' '}
                        <path d="M6 21v-7m-2 2l8 -8l8 8m-2 -2v7" />
                    </svg>
                </button>
                <div className={adminListClasses}>
                    <ChannelUserForm
                        currentChannel={currentChannel}
                        channelUsers={channelUsers}
                        handleClick={getClickHandler()}
                        setChannelUsers={setChannelUsers}
                    />{' '}
                </div>
            </div>
        </>
    );
}
