import React from "react";
import Message, { MessageProps} from "./Message";
import { Messages } from "./Messages";

export function MessageBox({
  senderId,
  username,
  message,
  posttime, 
}: MessageProps) {
  // user
  return (
    <div className="chat-message">
      <article
        className={
          senderId === username
            ? "msg-container msg-self"
            : "msg-container msg-remote"
        }
        id="msg-0"
      >
          <div className="flr">
            <Message
             senderId={senderId}
              username={username}
              message={message}
              posttime={posttime}
            />
        </div>
      </article>
    </div>
  );
}
