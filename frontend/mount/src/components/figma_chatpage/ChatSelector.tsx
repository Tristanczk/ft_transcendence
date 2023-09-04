import { useState } from "react";
import { UserSimplified } from "../../types";
import { FriendElement } from "./FriendElement";
import { ChatSelectorButton } from "./ChatSelectorButton";

export function ChatSelector({ friends }: { friends: UserSimplified[] | null }) {
	const [selectedChat, setSelectedChat] = useState<boolean>(true);

	return (
		<div className="Chatselectorframe rounded-3xl flex-col justify-start items-start gap-2.5 flex">
			<div className="Selectors w-96 h-12 left-0 top-0 absolute">
				{selectedChat ? <div className="w-96 h-44 left-0 top-[52px] absolute bg-stone-300 shadow flex-col justify-start items-start inline-flex">
					{friends && friends.map((friend, index) => (
						<FriendElement index={index} key={friend.id} friend={friend} />
					))}
				</div> : <h1>channels</h1>}
				<div className="w-96 h-12 relative">
					<ChatSelectorButton side={true} selectedChat={selectedChat} setSelectedChat={setSelectedChat} isActive={!selectedChat} />
					<ChatSelectorButton side={false} selectedChat={selectedChat} setSelectedChat={setSelectedChat} isActive={selectedChat} />
				</div>
			</div>
		</div>
	)
}