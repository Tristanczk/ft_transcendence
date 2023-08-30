import { UserSimplified } from '../../../types';
import ShowIsOnline from './ShowIsOnline';
import ImageFriend from './ImgFriend';
import { useUserContext } from '../../../context/UserContext';
import { Link } from 'react-router-dom';

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
    let i: number = 0;
    if (!friendsList)
        return <div className="mb-6">You don't have friends yet</div>;

    const max: number = friendsList.length;

    return friendsList.length > 0 ? (
        <>
            <div className="mb-1"></div>
            <div className="bg-white">
                <h1 className="text-xl font-bold dark:text-white">
                    Friend{friendsList.length !== 1 && 's'} list
                </h1>

                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    {friendsList.map((friend) => (
                        <li
                            className={
                                i === 0
                                    ? 'pb-3 sm:pb-4'
                                    : i === max
                                    ? 'pt-3 pb-0 sm:pt-4'
                                    : 'py-3 sm:py-4'
                            }
                            key={friend.id}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <ImageFriend
                                        userId={friend.id}
                                        textImg={friend.nickname}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        <Link to={"/dashboard/" + friend.id} >{friend.nickname}</Link>
                                        <ShowIsOnline
                                            userId={friend.id}
                                            initStatus={friend.isConnected}
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
        </>
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

    return (
        user && currUserId === user.id ? (
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <button
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={(event) =>
                        handleDeleteFriendClick(event, friendId)
                    }
                >
                    Delete friend
                </button>
            </div>
        ) : (<></>)
    );
}

export default ShowFriendList;
