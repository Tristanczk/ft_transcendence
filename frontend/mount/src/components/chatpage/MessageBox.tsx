import React from "react";
import Message, { MessageProps} from "./Message";
import { Messages } from "./Messages";

export function MessageBox({
  idSender,
  idChannel,
  message,
}: MessageProps) {
  // user
  const user = 1;

  return (
    <div className="chat-message">
      <article
        className={
          idSender === user
            ? "msg-container msg-self"
            : "msg-container msg-remote"
        }
        id="msg-0"
      >
          <div className="flr">
            <Message
             idSender={idSender}
              idChannel={idChannel}
              message={message}
            />
        </div>
      </article>
    </div>
  );
}
