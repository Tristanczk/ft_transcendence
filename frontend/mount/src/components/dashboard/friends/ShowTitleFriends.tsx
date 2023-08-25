import { UserSimplified } from '../../../types';

interface Props {
    friendsList: UserSimplified[] | null;
}

function ShowTitleFriends({ friendsList }: Props) {
    return (
        <>
            <div>
                <h1 className="text-5xl font-extrabold dark:text-white">
                    Friends
                    <small className="ml-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {/* You have {friendsList.length} friend
                        {friendsList.length !== 1 && 's'} */}
                        {friendsList
                            ? `You have ${friendsList.length} friend${
                                  friendsList.length > 1 ? 's' : ''
                              }`
                            : `You don't have any friends yet`}
                    </small>
                </h1>
            </div>
        </>
    );
}

export default ShowTitleFriends;
