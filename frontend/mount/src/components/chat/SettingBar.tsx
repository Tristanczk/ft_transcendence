import { ChannelProps } from './Messages';

export default function SettingBar({
    currentChannel,
}: {
    currentChannel: ChannelProps | null;
}) {
    const editPassword = async () => {};
    const banUser = async () => {};
    const exitChannel = async () => {};
    const editName = async () => {};
    const makeAdmin = async () => {};
    const muteUser = async () => {};

    return (
        <div className="relative flex-col items-center space-y-4 p-4 bg-gray-200 w-1/4 flex z-0 object-bottom object-fill right-24">
            <button
                name="Password"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    {' '}
                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                    <circle cx="8" cy="15" r="4" />{' '}
                    <line x1="10.85" y1="12.15" x2="19" y2="4" />{' '}
                    <line x1="18" y1="5" x2="20" y2="7" />{' '}
                    <line x1="15" y1="8" x2="17" y2="10" />
                </svg>
            </button>

            <button
                name="Ban"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    {' '}
                    <path
                        fill-rule="evenodd"
                        d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>

            <button
                name="Name"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-amber-300"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    {' '}
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
            </button>

            <button
                name="Admin"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-amber-300"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    {' '}
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
            </button>

            <button
                name="Mute"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500"
            >
                <svg
                    className="w-6 h-6"
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
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        clip-rule="evenodd"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                </svg>
            </button>
            <button
                name="Praise"
                type="button"
                className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
        </div>
    );
}
