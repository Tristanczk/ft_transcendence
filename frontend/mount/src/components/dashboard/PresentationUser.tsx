import { User } from '../../types';
import React from 'react';

interface PresentationUserProps {
	user: User;
}

function PresentationUser({user}: PresentationUserProps) {
	return (
	<div className="bg-orange-300 rounded-md flex">
		<div className='w-1/8'>
			<img src="/norminet.jpeg" alt="profile picture" className='w-20 h-20 rounded-full'/>
		</div>
		<div className='w-7/8'>
			Welcome, {user.nickname}! Your current ELO is {user.elo}. This is
			the {user.loginNb}th time you log in. Double authentication for your
			account is set to {user.twoFactorAuthentication ? 'true' : 'false'}.
		</div>
	</div>
	);
};

export default PresentationUser;


