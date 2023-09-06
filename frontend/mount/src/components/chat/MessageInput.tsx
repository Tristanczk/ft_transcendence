import { ChangeEvent, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useAuthAxios } from '../../context/AuthAxiosContext';

export default function MessageInput({ idChannel }: { idChannel: number }) {
    const [input, setInput] = useState('');
    const { user } = useUserContext();
    const authAxios = useAuthAxios();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		console.log('input: ', event.target.value);
        setInput(event.target.value);
    };

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		console.log('sending message', input, ' miao ' ,idChannel);
        if (input === '') return;
        setInput('');
        authAxios.post(
            '/chat/sendMessage',
            {
                idChannel: idChannel,
                idSender: user?.id,
                message: input,
            },
            { withCredentials: true },
        );
    };

    return (
        <div className="px-4 pt-4 mb-2 sm:mb-0 flex items-center pb-4 rounded-bl-3xl rounded-br-3xl bg-slate-200 shadow-xl">
            <input
                onChange={onChange}
                value={input}
                type="text"
                placeholder="Write your message!"
                className="focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 bg-white rounded-3xl py-3 pr-12 flex-grow border-white"
            ></input>
            <div className="relative">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </button>
            </div>
            <button
                onClick={(event) => onClick(event)}
                type="button"
                className="inline-flex items-center justify-center rounded-3xl px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-600 hover:bg-white hover:text-blue-600 focus:outline-none ml-2"
            >
                <span className="font-bold">Send</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
            </button>
        </div>
    );
}
