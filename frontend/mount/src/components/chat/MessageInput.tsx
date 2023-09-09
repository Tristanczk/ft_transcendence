import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { WebsocketContext } from '../../context/WebsocketContext';
import EmojiPicker, {
    Categories,
    EmojiClickData,
    EmojiStyle,
    SkinTonePickerLocation,
    SkinTones,
    SuggestionMode,
    Theme,
} from 'emoji-picker-react';

export default function MessageInput({ idChannel }: { idChannel: number }) {
    const [input, setInput] = useState('');
    const socket = useContext(WebsocketContext);
    const { user } = useUserContext();
    const authAxios = useAuthAxios();
    const [visiblePicker, setVisiblePicker] = useState(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('input: ', event.target.value);
        setInput(event.target.value);
    };

    const handleSendMessage = async () => {
        console.log('sending message', input, ' miao ', idChannel);
        if (input === '' || idChannel === 0) return;
        setInput('');
        const response = await authAxios.post(
            '/chat/sendMessage',
            {
                idSender: user?.id,
                idChannel: idChannel,
                message: input,
            },
            { withCredentials: true },
        );
        socket?.emit('message', {
            idSender: user?.id,
            idChannel: idChannel,
            message: input,
        });
    };

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
                setVisiblePicker(false);
            } else {
                setInput(input + '\n'); // TODO ne marche pas le newline. Enlever avant de push final si pas réso
            }
        }
    };

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        handleSendMessage();
    };

    const handleEmojiSelect = (emojiData: EmojiClickData) => {
        setInput((input) => input + emojiData.emoji);
        refocusInput();
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const refocusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    };

    const pickerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click was outside the picker and not on the button.
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setVisiblePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [pickerRef, buttonRef]);

    return (
        <div className="px-4 pt-4 mb-2 sm:mb-0 flex items-center pb-4 rounded-bl-3xl rounded-br-3xl bg-slate-200 shadow-xl">
            <input
                ref={inputRef}
                onChange={onChange}
                onKeyDown={onKeyPress}
                value={input}
                type="text"
                placeholder="Write your message!"
                className="focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 bg-white rounded-3xl py-3 pr-12 flex-grow border-white"
            ></input>
            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                        setVisiblePicker((prevVisible) => !prevVisible);
                        if (!visiblePicker) {
                            refocusInput();
                        }
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </button>
                {visiblePicker && (
                    <div
                        ref={pickerRef}
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            bottom: '48px',
                            right: '0px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            borderRadius: '1.5rem',
                        }}
                    >
                        <EmojiPicker
                            height={370}
                            width={282}
                            onEmojiClick={handleEmojiSelect}
                            emojiVersion="5.0"
                            skinTonesDisabled={true}
                            previewConfig={{
                                defaultCaption: '',
                                defaultEmoji: '',
                            }}
                            searchPlaceHolder="Choose your emoji"
                            emojiStyle={EmojiStyle.APPLE}
                        />
                    </div>
                )}
            </div>
            <button
                onClick={(event) => onClick(event)}
                type="button"
                className="inline-flex items-center justify-center rounded-3xl px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-600 hover:bg-white hover:text-blue-600 focus:outline-none ml-2"
            >
                <span className="font-bold"></span>
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
