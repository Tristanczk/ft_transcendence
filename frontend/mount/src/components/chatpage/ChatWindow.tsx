import React from 'react';
import { MessageBox } from './MessageBox';
import { MessageProps } from './Message';
import ChatHeader from './ChatHeader';

export interface ChatWindowProps {
    messages: MessageProps[];
}

export default function ChatWindow({ messages, channel }: ChatWindowProps & { channel: number }) {
    return (
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {messages.map((message, index) => {
                    if (message.idChannel === channel) {
                        return (
                            <MessageBox
                                key={index}
                                idSender={message.idSender}
                                idChannel={message.idChannel}
                                message={message.message}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
