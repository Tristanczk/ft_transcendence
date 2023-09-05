import { MessageProps } from '../chat/Messages';
import { MessageBox } from './MessageBox';

export interface ChatWindowProps {
    messages: MessageProps[];
}

export default function ChatWindow({ messages, channel }: ChatWindowProps & { channel: number }) {
    return (
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
            <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            <h3>Channel {channel}</h3>
            {messages.map((message, index) => {
                    if (message.idChannel === channel) {
                        return (
                            <MessageBox
                                key={index}
                                idSender={message.idSender}
                                idChannel={message.idChannel}
                                message={message.message}
                                createdAt={message.createdAt}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}
