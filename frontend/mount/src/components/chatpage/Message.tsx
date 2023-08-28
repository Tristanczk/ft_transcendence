import React from 'react';
import Timestamp from './Timestamp';

export interface MessageProps {
    senderId: string;
    username: string;
    message: string;
    posttime: string;
}

export default function Message({ senderId, message, posttime }: MessageProps) {
    return (
        <div className="chat-message">
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <span
                        className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                        id="msgID"
                    >
                        {message}
                    </span>
                </div>
                <img
                    src="https://ih1.redbubble.net/image.1329995133.5500/st,small,507x507-pad,600x600,f8f8f8.jpg"
                    alt="My profile"
                    className="w-6 h-6 rounded-full order-1"
                ></img>
            </div>
        </div>
    );
}
