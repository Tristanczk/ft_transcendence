import React from "react";
import Message, { MessageProps} from "./Message";
import { useUserContext } from "../../context/UserContext";

export function MessageBox({
  idSender,
  idChannel,
  message,
}: MessageProps) {
  // user
  const { user } = useUserContext();

  return (
    <div className="chat-message">
      <article
        className={
          idSender === user?.id
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
