import { User } from '../../types';
import React from 'react';
import GlobalStats from '../stats/GlobalStats';
import HistoryFive from '../stats/HistoryFive';
import HistoryElo from '../stats/HistoryElo';
import ShowAchievements from '../stats/ShowAchievements';

interface PresentationUserProps {
    user: User;
}

function StatsUser({ user }: PresentationUserProps) {
    return (
        <>
            <h1 className="text-5xl font-extrabold dark:text-white">Games</h1>
            <GlobalStats user={user} />
            <ShowAchievements userView={user} />
            <HistoryElo user={user} />
            <HistoryFive user={user} />
        </>
    );
}

export default StatsUser;
