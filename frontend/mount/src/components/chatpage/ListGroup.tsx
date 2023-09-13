import { ListGroup } from 'flowbite-react';
import { UserSimplified } from '../../types';
import ChatHeader from './ChatHeader';

export default function ListGroupWithButton({ users }: { users: UserSimplified[] | null }) {

	if (!users)
		return (
			<div></div>
		);
	return (
		<ListGroup>
			{users.map((user, index) => (
				<ListGroup.Item key={index}>
					<ChatHeader nickname={user.nickname} />
				</ListGroup.Item>
			))}
		</ListGroup>
	)
}


