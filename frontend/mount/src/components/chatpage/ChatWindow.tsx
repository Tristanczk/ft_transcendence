import React from "react";
import { MessageBox } from "./MessageBox";
import { MessageProps } from "./Message";

export interface ChatWindowProps {
  messages: MessageProps[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <section className="chat-window">
      {messages.map((message, index) => (
        <MessageBox
          key={index}
          senderId={message.senderId}
          username={message.username}
          message={message.message}
		  posttime={message.posttime}
        />
      ))}
    </section>
  );
}
