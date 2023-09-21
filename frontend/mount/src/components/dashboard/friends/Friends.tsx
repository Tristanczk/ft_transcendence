import { User, UserSimplified } from '../../../types';
import { useState, useEffect } from 'react';
import ShowFriendList from './ShowFriendList';
import ShowTitleFriends from './ShowTitleFriends';
import AddFriendElem from './AddFriendElem';
import { useAuthAxios } from '../../../context/AuthAxiosContext';
import { useUserContext } from '../../../context/UserContext';
import { Alert } from '../../chat/Alert';

interface FriendsProps {
    currUser: User;
}

function Friends({ currUser }: FriendsProps) {
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );
    const [change, setChange] = useState<boolean>(false);
    const { user } = useUserContext();
    const authAxios = useAuthAxios();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const closeAlert = () => {
        setAlertMessage(null);
    };

    useEffect(() => {
        const fetchFriends = async () => {
            getMyFriends();
        };
        fetchFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            getMyFriends();
        };
        fetchFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currUser]);

    const getMyFriends = async () => {
        // import user friends list
        try {
            const response = await authAxios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/${currUser.id}`,
                { withCredentials: true },
            );
            setFriendsList(response.data);
        } catch (error) {
            setFriendsList(null);
            setAlertMessage('Error fetching friends list');
        }
    };

    const handleClickAddFriend = async (event: any, idSelected: number) => {
        event.preventDefault();
        if (idSelected === -1) return;
        if (idSelected !== currUser.id) {
            try {
                await authAxios.post(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/${idSelected}`,
                    { id: idSelected },
                    { withCredentials: true },
                );

                await authAxios.post(
                    '/chat/createChannel',
                    {
                        idUser: [user?.id, idSelected],
                        name: 'Private message',
                        isPublic: false,
                    },
                    { withCredentials: true },
                );
            } catch (error) {
                console.error(error);
            }
            getMyFriends();
            setChange(true);
        } else setAlertMessage("You can't add yourself as a friend!");
    };

    const handleDeleteFriendClick = async (event: any, idToDelete: number) => {
        event.preventDefault();
        if (!idToDelete) return;
        try {
            await authAxios.delete(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/${idToDelete}`,
                {
                    withCredentials: true,
                },
            );
        } catch (error) {
            console.error(error);
            setAlertMessage('Error deleting friend');
        }
        getMyFriends();
        setChange(true);
    };

    return (
        <>
            {alertMessage && (
                <Alert message={alertMessage} onClose={closeAlert} />
            )}
            <div>
                <ShowTitleFriends
                    friendsList={friendsList}
                    idUser={currUser.id}
                />
                <ShowFriendList
                    friendsList={friendsList}
                    handleDeleteFriendClick={handleDeleteFriendClick}
                    currUserId={currUser.id}
                />
                {user && user.id === currUser.id && (
                    <div className="mb-6">
                        <AddFriendElem
                            ButtonAddFriend={handleClickAddFriend}
                            ButtonDeleteFriend={handleDeleteFriendClick}
                            change={change}
                            setChange={setChange}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default Friends;
