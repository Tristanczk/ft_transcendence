import { User } from '../../types';
import React from 'react';
import GlobalStats from '../stats/GlobalStats';

interface PresentationUserProps {
    user: User;
}

function StatsUser({ user }: PresentationUserProps) {
    return (
        <>
            <h1 className="text-5xl font-extrabold dark:text-white">Games</h1>
			<GlobalStats />

            {/* <div>
                <div>
                    <div>Game played:</div>
                    <div>Game won: (ratio: )</div>
					<div>Elo: </div>

					<div>Games history</div>
					<ul>
						<li key='uni'>Picture NicknamePlayer (elo) Result (red) </li>
						<li key='una'>Picture NicknamePlayer (elo) Result (green) </li>
						<li key='unb'>Picture NicknamePlayer (elo) Result (red) </li>
					</ul>
                </div>
            </div> */}
        </>
    );
}

export default StatsUser;
