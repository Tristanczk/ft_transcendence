import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import { MessageProps } from '../components/chatpage/Message';
import { MessageInput } from '../components/chatpage/MessageInput';
import { socket as constSocket } from '../context/WebsocketContext';
import ButtonsBar from '../components/chatpage/ButtonsBar';
import ChannelsBox, { ChannelProps } from '../components/chatpage/Channels';
import axios from 'axios';

function ChatPage() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined); // Initialize socket as undefined
    const [messages, setMessages] = useState<ChatWindowProps['messages']>([]);
    const [channels, setChannels] = useState<ChannelProps[]>([]);

    const send = (message: MessageProps) => {
        socket?.emit('message', {
            idSender: message.idSender,
            idChannel: message.idChannel,
            message: message.message,
        });
    };

    const createChannel = async (channel: ChannelProps) => {
        try {
            await axios.post('http://localhost:3333/channels', {
                idAdmin: channel.idAdmin,
                name: channel.name,
            });
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    useEffect(() => {
        // Fetch channels from the backend
        async function fetchChannels() {
            try {
                const response = await axios.get('/api/get-channels');
                setChannels(response.data);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        }

        fetchChannels();
    }, []);

    useEffect(() => {
        setSocket(constSocket);
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        if (socket) {
            const messageListener = ({
                idSender,
                idChannel,
                message,
            }: {
                idSender: number;
                idChannel: number;
                message: string;
            }) => {
                console.log(idSender);
                const newMessage: MessageProps = {
                    idSender: idSender,
                    idChannel: idChannel,
                    message: message,
                };

                setMessages((oldMessages) => [...oldMessages, newMessage]);
                console.log('setting oldmessages to message');
            };
            return () => {
                socket.off('message', messageListener);
            };
        }
    }, [socket]); // Make sure to include socket as a dependency

    console.log(messages);
    return (
        <div className="ChatPage">
            <ButtonsBar createChannel={createChannel}/>
            <ChannelsBox channels={channels} />
            <section className="Tchatbox">
                <ChatWindow messages={messages} />
                <MessageInput send={send} />
            </section>
        </div>
    );
}

export default ChatPage;
