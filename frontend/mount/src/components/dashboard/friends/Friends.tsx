import { User, UserSimplified } from '../../../types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShowFriendList from './ShowFriendList';

interface FriendsProps {
    user: User;
    userList: User[] | null;
}

function Friends({ user, userList }: FriendsProps) {
    const [friendsList, setFriendsList] = useState<UserSimplified[] | null>(
        null,
    );
    const [possibleFriendsList, setPossibleFriendsList] = useState<
        UserSimplified[]
    >([]);
    const [idSelectedToAddFriend, setIdSelectedToAddFriend] = useState(-1);

    useEffect(() => {
        const fetchFriends = async () => {
            getMyFriends();
            getPossibleFriends();
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

    const getPossibleFriends = async () => {
        // import user possible friends list
        try {
            const response = await axios.get(
                'http://localhost:3333/friends/possiblefriends',
                { withCredentials: true },
            );
            setPossibleFriendsList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClickAddFriend = async (event: any) => {
        event.preventDefault();
        console.log('button clicked to add=' + idSelectedToAddFriend);
        if (idSelectedToAddFriend === -1) return;
        if (idSelectedToAddFriend !== user.id) {
            // console.log('done');
            try {
                const response = await axios.post(
                    `http://localhost:3333/friends/${idSelectedToAddFriend}`,
                    { id: idSelectedToAddFriend },
                    { withCredentials: true },
                );
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
            getMyFriends();
            getPossibleFriends();
            setIdSelectedToAddFriend(-1);
        } else alert("You can't add yourself as a friend!");
    };

    const handleDeleteFriendClick = async (event: any, idToDelete: number) => {
        event.preventDefault();
        if (!idToDelete) return;
        // console.log('try to delete')
        try {
            const response = await axios.delete(
                `http://localhost:3333/friends/${idToDelete}`,
                { withCredentials: true },
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        getMyFriends();
        getPossibleFriends();
    };

    const handleChangeListChooseFriend = (event: any) => {
        const choice: number = parseInt(event.target.value);
        setIdSelectedToAddFriend(choice);
    };

    return userList ? (
        <>
            <div className="bg-white rounded-md">
                <ShowFriendList
                    friendsList={friendsList}
                    handleDeleteFriendClick={handleDeleteFriendClick}
                />

                <div className="mb-6">
                    <legend>Add a friend:</legend>
                    <form>
                        <label htmlFor="users">
                            Select a user to become friend with:{' '}
                        </label>
                        <select
                            name="users"
                            id="users"
                            onChange={handleChangeListChooseFriend}
                        >
                            <option value="-1" key="-1">
                                Choose
                            </option>
                            {possibleFriendsList.map((user) => (
                                <option value={user.id} key={user.id}>
                                    {user.nickname}
                                </option>
                            ))}
                        </select>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(event) => handleClickAddFriend(event)}
                        >
                            Add friend!
                        </button>
                    </form>
                </div>
            </div>
        </>
    ) : (
        <div>No friends</div>
    );
}

export default Friends;