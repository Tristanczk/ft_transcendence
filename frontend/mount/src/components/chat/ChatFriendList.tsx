import { UserSimplified } from '../../types';
import ChatFriendListElement from './ChatFriendListElement';

export default function ChatFriendList({
    friends,
    chatSelector,
    currentChat,
}: {
    friends: UserSimplified[] | null;
    chatSelector: (friend: UserSimplified) => void;
    currentChat: UserSimplified | null;
}) {
    return (
        <div
            id="list"
            className="flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip rounded-br-3xl rounded-bl-3xl mb-6 shadow-xl"
        >
            <div className={`flex flex-col overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white overflow-clip ${currentChat?"h-36":"h-96"}`}>
                {friends &&
                    friends.map((friend, index) => (
                        <ChatFriendListElement
                            key={friend.id}
                            friend={friend}
                            chatSelector={chatSelector}
                        />
                    ))}
            </div>
        </div>
    );
}
