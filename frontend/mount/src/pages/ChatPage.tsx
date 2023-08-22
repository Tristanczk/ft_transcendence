import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { MessageInput } from '../components/chatpage/MessageInput';
import { Messages } from '../components/chatpage/Messages'

const ChatPage: React.FC = () => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const send = (value: string) => {
        console.log(value);
        socket?.emit('message', value);
    };

    useEffect(() => {
        const newSocket = io('https://localhost:3003');
        setSocket(newSocket);
    }, []);

    
    useEffect(() => {
        const messageListener = (message: string) => {
            setMessages(prevMessages => [...prevMessages, message]);
        };
        socket?.on('message', messageListener);
        return () => {
            socket?.off('message', messageListener);
        };
    }, [socket]);
    return (
        <>
            {" "}
            <MessageInput send={send}/>
            <Messages messages={messages}/>
        </>
    );
};

export default ChatPage;
