import { useUserContext } from '../../../context/UserContext';
import { UserSimplified } from '../../../types';

interface Props {
    friendsList: UserSimplified[] | null;
    idUser: number;
}

function ShowTitleFriends({ friendsList, idUser }: Props) {
    const { user } = useUserContext();

    return (
        <div className="text-center">
            <h1 className="text-4xl dark:text-white font-semibold p-4">
                Friends
            </h1>
            <small className="ml-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                {friendsList && friendsList.length > 0
                    ? `${idUser === user?.id ? `You have ` : ``} ${
                          friendsList.length
                      } friend${friendsList.length > 1 ? 's' : ''}`
                    : idUser === user?.id
                    ? "You don't have any friends yet"
                    : 'No friends'}
            </small>
        </div>
    );
}

export default ShowTitleFriends;
