import { User } from '../../types';
import React from 'react';

interface PresentationUserProps {
	user: User;
}

function StatsUser({user}: PresentationUserProps) {
	return (
	<div className="bg-yellow-300 rounded-md">
		<div>
			<div>Game played:</div>
			<div>Game won: (ratio: )</div>
			
		</div>
	</div>
	);
};

export default StatsUser;


