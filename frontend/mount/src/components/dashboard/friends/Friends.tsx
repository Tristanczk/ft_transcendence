import { User, UserSimplified } from '../../../types';
import { useState, useEffect } from 'react';
import ShowFriendList from './ShowFriendList';
import ShowTitleFriends from './ShowTitleFriends';
import AddFriendElem from './AddFriendElem';
import { useAuthAxios } from '../../../context/AuthAxiosContext';
import { useUserContext } from '../../../context/UserContext';

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
                `http://localhost:3333/friends/${currUser.id}`,
                { withCredentials: true },
            );
            setFriendsList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickAddFriend = async (event: any, idSelected: number) => {
        event.preventDefault();
        // console.log('button clicked to add=' + idSelected);
        if (idSelected === -1) return;
        if (idSelected !== currUser.id) {
            try {
                await authAxios.post(
                    `http://localhost:3333/friends/${idSelected}`,
                    { id: idSelected },
                    { withCredentials: true },
                );
                // console.log(response.data);
            } catch (error) {
                console.error(error);
            }
            getMyFriends();
            setChange(true);
        } else alert("You can't add yourself as a friend!");
    };

    const handleDeleteFriendClick = async (event: any, idToDelete: number) => {
        event.preventDefault();
        if (!idToDelete) return;
        // console.log('try to delete')
        try {
            await authAxios.delete(
                `http://localhost:3333/friends/${idToDelete}`,
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        getMyFriends();
        setChange(true);
    };

    return (
        <>
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
