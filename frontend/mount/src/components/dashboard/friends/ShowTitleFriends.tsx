import { useUserContext } from '../../../context/UserContext';
import { UserSimplified } from '../../../types';

interface Props {
    friendsList: UserSimplified[] | null;
    idUser: number;
}

function ShowTitleFriends({ friendsList, idUser }: Props) {
    const { user } = useUserContext();

    return (
        <>
            <div>
                <h1 className="text-5xl font-extrabold dark:text-white">
                    Friends
                    <small className="ml-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {friendsList
                            ? `${idUser === user?.id ? `You have ` : ``} ${
                                  friendsList.length
                              } friend${friendsList.length > 1 ? 's' : ''}`
                            : idUser === user?.id
                            ? `You don't have any friends yet`
                            : `No friends`}
                    </small>
                </h1>
            </div>
        </>
    );
}

export default ShowTitleFriends;
