import React from "react";
import Timestamp from "./Timestamp";

export interface MessageProps {
  senderId: string;
  username: string;
  message: string;
  posttime: string;
}

export default function Message({ senderId, message, posttime }: MessageProps) {
  return (
    <div>
      <div className="messages">
        <p className="msg" id="msgID">
          {message}
        </p>
      </div>
      <Timestamp username={senderId} posttime={posttime} />
    </div>
  );
}
