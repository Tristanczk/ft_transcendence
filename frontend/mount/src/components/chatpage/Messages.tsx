import React from "react";

export function Messages({ messages }: { messages: string[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div className="messages" key={index}>
          <p>{message}</p>
        </div>
      ))}
    </div>
  );
}
