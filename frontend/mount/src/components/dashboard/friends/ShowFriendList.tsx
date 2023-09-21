import { UserSimplified } from '../../../types';
import ShowIsOnline from './ShowIsOnline';
import ImageFriend from './ImageFriend';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../../context/UserContext';

interface Props {
    friendsList: UserSimplified[] | null;
    handleDeleteFriendClick: (event: any, idToDelete: number) => Promise<void>;
    currUserId: number;
}

interface ButtonProps {
    friendId: number;
    currUserId: number;
    handleDeleteFriendClick: (event: any, idToDelete: number) => Promise<void>;
}

function ShowFriendList({
    friendsList,
    handleDeleteFriendClick,
    currUserId,
}: Props) {
    if (!friendsList) return <div className="mb-6">No friends</div>;

    return friendsList.length > 0 ? (
        <div className="bg-white">
            <ul className="flex flex-wrap my-6 justify-center divide-y divide-gray-200 dark:divide-gray-700 sm:divide-none">
                {friendsList.map((friend) => (
                    <li className="w-full sm:w-1/2 lg:w-1/3" key={friend.id}>
                        <div className="relative p-4">
                            <div className="flex-shrink-0">
                                <ImageFriend
                                    userId={friend.id}
                                    textImg={friend.nickname}
                                    size={8}
                                />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <p className="text-sm font-medium text-gray-900 dark:text-white hover:font-bold flex-shrink-0">
                                    <Link
                                        to={'/dashboard/' + friend.id}
                                        className="truncate"
                                    >
                                        {friend.nickname}
                                    </Link>
                                    <ShowIsOnline
                                        userId={friend.id}
                                        initStatus={friend.isConnected}
                                        playingStatus={friend.isPlaying}
                                        text={true}
                                    />
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    elo: {friend.elo}
                                </p>
                            </div>
                            <DeleteButton
                                friendId={friend.id}
                                currUserId={currUserId}
                                handleDeleteFriendClick={
                                    handleDeleteFriendClick
                                }
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <div className="mb-1">No friends</div>
    );
}

function DeleteButton({
    friendId,
    currUserId,
    handleDeleteFriendClick,
}: ButtonProps) {
    const { user } = useUserContext();

    return user && currUserId === user.id ? (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <button
                className="text-gray-900 mt-3 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-3xl text-xs px-3 py-1 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={(event) => handleDeleteFriendClick(event, friendId)}
            >
                Delete friend
            </button>
        </div>
    ) : (
        <></>
    );
}

export default ShowFriendList;
