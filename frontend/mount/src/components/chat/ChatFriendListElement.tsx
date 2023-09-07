import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';

export default function ChatFriendListElement({
    friend,
	chatSelector,
}: {
    friend: UserSimplified;
	chatSelector: (friend: UserSimplified) => void;
}) {
    return (
        <div className="p-1 px-3 flex items-center justify-between border-t cursor-pointer hover:bg-gray-200">
            <div className="flex items-center">
                <ImageFriend
                    userId={friend.id}
                    textImg={friend.nickname}
                    size={7}
                />
                <div className="ml-2 flex flex-col">
                    <div className="leading-snug text-sm text-gray-900 font-medium">
                        {friend.nickname}
                    </div>
                </div>
            </div>
            <button
				onClick={() => {chatSelector(friend)}}>
                {' '}
                <svg
                    className="text-blue-600 w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    {' '}
                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                    <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />{' '}
                    <line x1="12" y1="12" x2="12" y2="12.01" />{' '}
                    <line x1="8" y1="12" x2="8" y2="12.01" />{' '}
                    <line x1="16" y1="12" x2="16" y2="12.01" />
                </svg>
            </button>
        </div>
    );
}