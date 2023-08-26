import { User, UserSimplified } from '../../../types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ShowFriendList from './ShowFriendList';
import ShowTitleFriends from './ShowTitleFriends';
import AddFriendElem from './AddFriendElem';

interface FriendsProps {
    user: User;
}

function Friends({ user }: FriendsProps) {
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        const fetchFriends = async () => {
            getMyFriends();
        };
        fetchFriends();
    }, []);

    const getMyFriends = async () => {
        // import user friends list
        try {
            const response = await axios.get(
                'http://localhost:3333/friends/me',
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
        if (idSelected !== user.id) {
            try {
                await axios.post(
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
            await axios.delete(`http://localhost:3333/friends/${idToDelete}`, {
                withCredentials: true,
            });
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        getMyFriends();
        setChange(true);
    };

    return (
        <div>
            <ShowTitleFriends friendsList={friendsList} />
            <ShowFriendList
                friendsList={friendsList}
                handleDeleteFriendClick={handleDeleteFriendClick}
            />
            <div className="mb-6">
                <AddFriendElem
                    ButtonAddFriend={handleClickAddFriend}
                    ButtonDeleteFriend={handleDeleteFriendClick}
                    change={change}
                    setChange={setChange}
                />
            </div>
        </div>
    );
}

export default Friends;
