import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';
import { ChannelProps } from './Messages';

export default function ChannelHeader({
    channel,
    handleClose,
    currentChannel,
    onClick,
}: {
    channel: number;
    handleClose: () => void;
    currentChannel: ChannelProps | null;
    onClick: () => void;
}) {
    const { user } = useUserContext();
    const authAxios = useAuthAxios();

    const leaveChannel = async () => {
        try {
            await authAxios.patch(
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
        }
    };

    if (!currentChannel) return <div></div>;
    return (
        <div className="flex sm:items-center justify-between py-2 md:py-6 bg-gray-900 px-3 rounded-tl-3xl rounded-tr-3xl shadow-2xl">
            <div className="relative flex items-center space-x-4">
                <div className="relative">
                    <span className="absolute text-green-500 right-0 bottom-0">
                        <svg width="20" height="20"></svg>
                    </span>
                </div>
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span className="group inline-block hover:scale-110 text-gray-300 mr-3 transition-transform duration-300 ease-in-out">
                            {currentChannel.name}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {currentChannel?.idAdmin.includes(user?.id ? user.id : 0) ? (
                    <button
                        onClick={onClick}
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 sm:h-10 sm:w-10 transition-all duration-500 ease-in-out focus:outline-none bg-gray-700 hover:bg-amber-400 transform hover:scale-110"
                    >
                        <svg
                            className="transition-all duration-500 w-4 h-4 sm:w-6 sm:h-6 rotate-[90deg] hover:text-gray-800 "
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            {' '}
                            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                        </svg>
                    </button>
                ) : (
                    <button
                        onClick={leaveChannel}
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg h-8 w-8 sm:h-10 sm:w-10 transition-all duration-500 ease-in-out focus:outline-none bg-gray-700 hover:bg-amber-300 transform hover:scale-110"
                    >
                        <svg
                            className="transition-all duration-500 w-4 h-4 sm:w-6 sm:h-6 hover:text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                        </svg>
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-lg h-8 w-8 sm:h-10 sm:w-10 transition-all duration-500 ease-in-out focus:outline-none bg-gray-700 hover:bg-rose-600 transform hover:scale-110"
                >
                    <svg
                        className="transition-all duration-500 w-4 h-4 sm:w-6 sm:h-6 hover:text-gray-800"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        {' '}
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
