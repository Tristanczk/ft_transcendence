import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import { MessageProps } from '../components/chatpage/Message';
import { MessageInput } from '../components/chatpage/MessageInput';
import { socket as constSocket } from '../context/WebsocketContext';
import { Button } from 'flowbite-react';
import { useAuthAxios } from '../context/AuthAxiosContext';

function ChatPage() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined); // Initialize socket as undefined
  const [messages, setMessages] = useState<ChatWindowProps["messages"]>([]);
  const authAxios = useAuthAxios();

  const send = (message: MessageProps) => {
    socket?.emit('message', { idSender: message.idSender, idChannel: message.idChannel, message: message.message });
  };

  useEffect(() => {
    setSocket(constSocket);
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (socket) {
      const messageListener = ({ idSender, idChannel, message }: { idSender: number; idChannel: number; message: string }) => {
        console.log(idSender);
        const newMessage: MessageProps = {
          idSender: idSender,
          idChannel: idChannel,
          message: message,
        };

        setMessages((oldMessages) => [...oldMessages, newMessage]);
        console.log("setting oldmessages to message")
      };

      socket.on('message', messageListener);

      return () => {
        socket.off('message', messageListener);
      };
    }
  }, [socket]); // Make sure to include socket as a dependency

  const onCreateChannel = async (event: any) => {
    event.preventDefault();
    const reponse =
      await authAxios.post(
        '/chat/createChannel',
        {
          idUser: 1,
          name: "miao",
          isPublic: false,
        } ,
        { withCredentials: true }
      );
  }

  console.log(messages);
  return (
    <div className="ChatPage">
      <section className="chatbox">
        <Button text="miao" type="button" onClick={onCreateChannel} />
        <ChatWindow messages={messages} />
        <MessageInput send={send} />
      </section>
    </div>
  );
}

export default ChatPage;
