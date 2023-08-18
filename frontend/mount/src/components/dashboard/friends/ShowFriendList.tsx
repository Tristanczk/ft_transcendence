import { UserSimplified } from '../../../types';
// import ImageFriend from './imgFriend';

interface Props {
    friendsList: UserSimplified[] | null;
    handleDeleteFriendClick: (event: any, idToDelete: number) => Promise<void>;
}

function ShowFriendList({ friendsList, handleDeleteFriendClick }: Props) {
    let i: number = 0;
    if (!friendsList)
        return <div className="mb-6">You don't have friends yet</div>;

    const max: number = friendsList.length;

    
    console.log('before');
    console.log(friendsList);

    // friendsList.forEach((friend) => friend.avatarPath = loadFriendImage(friend.id));

    console.log('after');
    console.log(friendsList);

    return friendsList.length > 0 ? (
        <>
            <div className="mb-6">
                You have {friendsList.length} friend
                {friendsList.length !== 1 && 's'}
            </div>
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
                                    {/* <ImageFriend friend={friend} /> */}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {friend.nickname}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        elo: {friend.elo}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                    <button
                                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        onClick={(event) =>
                                            handleDeleteFriendClick(
                                                event,
                                                friend.id,
                                            )
                                        }
                                    >
                                        Delete friend
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}

                    {/* <li className="pb-3 sm:pb-4" key={friend.id}>
					<div className="flex items-center space-x-4">{friend.nickname}</div> (elo={friend.elo}) 
					<button 
						className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
						onClick={(event) => handleDeleteFriendClick(event, friend.id)}>
						Delete friend
					</button>
				</li>
				)} */}
                </ul>
            </div>
        </>
    ) : (
        <div className="mb-6">You don't have friends yet</div>
    );
}

export default ShowFriendList;
