import { UserSimplified } from '../../types';

interface	Props {
	friendsList: UserSimplified[] | null
}

function ShowFriendList({friendsList}: Props) {
	return friendsList? (
		<>
			<div className='mb-6'>You have {friendsList ? friendsList.length : 0} friends</div>
		</>
	) : (
		<div className='mb-6'>You don't have friends yet</div>
	);
}

export default ShowFriendList