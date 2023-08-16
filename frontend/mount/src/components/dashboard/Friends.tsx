import { User } from '../../types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PresentationUserProps {
	user: User;
}

function Friends({user}: PresentationUserProps) {

	const [userList, setUserList] = useState<User[] | null>(null);
	const [idSelectedToAddFriend, setIdSelectedToAddFriend] = useState(-1);
	let filteredUserList: User[] | null = [];

	const	handleClickAddFriend = (event: any) => {
		event.preventDefault();
		console.log('button clicked to add=' + idSelectedToAddFriend)
		if (idSelectedToAddFriend === -1)
			return;
		if (idSelectedToAddFriend !== user.id)
		{
			;
		}
		else
			alert('You can\'t add yourself as a friend!')
	}

	const	handleChangeListChooseFriend = (event: any) => {
		const choice: number = parseInt(event.target.value)
		// console.log('choix=' + choice)
		setIdSelectedToAddFriend(choice)
	} 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/',
                    { withCredentials: true },
                );
                setUserList(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

	useEffect(() => {
		console.log('userList updated:', userList);
		
		if (!userList)
			return;
		filteredUserList = userList.filter((userL) => userL.id !== user.id );

		console.log('filteredUserList updated:', filteredUserList);

	}, [userList]);
	

	return userList ? (
        <>
			<div className="bg-blue-300 rounded-md">
				<div className='mb-6'>You have {userList.length} friends</div>
				
				<div className='mb-6'>
					<legend>Add a friend:</legend>
					<form>
						<label htmlFor="users">Select a user to become friend with: </label>
						<select name="users" id="users" onChange={handleChangeListChooseFriend}>
							<option value='-1' key='-1'>Choose</option>
							{userList.map((user) => (<option value={user.id} key={user.id}>{user.nickname}</option>))}
						</select>
						<button 
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' 
							onClick={(event) => handleClickAddFriend(event)}>
								Add friend!
						</ button>
					</form>
				</div>
				
			</div>
		</>
    ) : (
        <div>No friends</div>
    );
};

export default Friends;


