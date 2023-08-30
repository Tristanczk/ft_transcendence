import React from "react";

interface TimestampProps {
  username: string;
  posttime: string;
}

export default function Timestamp({ username, posttime }: TimestampProps) {
  const minutes = Number(posttime);
  const hours = Math.floor(Number(posttime) / 60);
  return (
    <div>
      <span className="timestamp">
        <span className="username">{username}</span>&bull;
        <span className="posttime">
          {minutes < 2
            ? "just now"
            : minutes < 60
            ? minutes + "minutes ago"
            : hours + hours > 1
            ? "hours ago"
            : "hour ago"}{" "}
        </span>
      </span>
    </div>
  );
}
