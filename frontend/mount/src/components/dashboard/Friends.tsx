import { User } from '../../types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// function PresentatationUser(user: User) {

interface PresentationUserProps {
	user: User;
}

function Friends({user}: PresentationUserProps) {

	const [userList, setUserList] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/friends/',
                    { withCredentials: true },
                );
                setUserList(response.data.nickname);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

	return (
	<div className="bg-blue-300 rounded-md flex">
		<div>You have x friends</div>

		<form>Add a friend:</form>

		<div>
			liste users
			<ul>
				names
				{userList.map((user) => (<li key={user.id}></li>))}
				
			</ul>
		</div>
	</div>
	);
};

export default Friends;


