import { UserSimplified } from '../../types';

interface	Props {
	friendsList: UserSimplified[] | null,
	handleDeleteFriendClick: (event: any, idToDelete: number) => Promise<void>
}

function ShowFriendList({friendsList, handleDeleteFriendClick}: Props) {
	if (!friendsList)
		return (<div className='mb-6'>You don't have friends yet</div>)
	return friendsList.length > 0 ? (
		<>
			<div className='mb-6'>You have {friendsList.length} friend{friendsList.length !== 1 && 's'}</div>
			<div className='mb-6'>
				<ul>
				Friend list:
				{friendsList.map((friend) => <li key={friend.id}>{friend.nickname} (elo={friend.elo}) <button onClick={(event) => handleDeleteFriendClick(event, friend.id)}>Delete friend</button></li>)}
				</ul>
			</div>
		</>
	) : (
		<div className='mb-6'>You don't have friends yet</div>
	);
}

export default ShowFriendList