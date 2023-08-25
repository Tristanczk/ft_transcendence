import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import { MessageProps } from '../components/chatpage/Message';
import { MessageInput } from '../components/chatpage/MessageInput';
import { socket as constSocket } from '../context/WebsocketContext';

function ChatPage() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined); // Initialize socket as undefined
  const [messages, setMessages] = useState<ChatWindowProps["messages"]>([]);

  const send = (message: MessageProps) => {
    socket?.emit('message', { senderId: message.senderId, message: message.message});
  };

  useEffect(() => {
    setSocket(constSocket);
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (socket) {
      const messageListener = ({senderId, message} : { senderId: string; message: string }) => {
       console.log(senderId);
        const newMessage: MessageProps = {
          senderId: senderId,
          username: "username",
          message: message,
          posttime: "now",
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

  console.log(messages);
  return (
    <div className="ChatPage">
      <section className="chatbox">
        <ChatWindow messages={messages} />
        <MessageInput user="Me" send={send} />
      </section>
    </div>
  );
}

export default ChatPage;
