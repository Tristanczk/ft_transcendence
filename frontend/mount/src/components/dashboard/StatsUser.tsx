import { User } from '../../types';
import React from 'react';

interface PresentationUserProps {
    user: User;
}

function StatsUser({ user }: PresentationUserProps) {
    return (
        <>
            <h1 className="text-5xl font-extrabold dark:text-white">Stats</h1>

            <div>
                <div>
                    <div>Game played:</div>
                    <div>Game won: (ratio: )</div>
                </div>
            </div>
        </>
    );
}

export default StatsUser;
