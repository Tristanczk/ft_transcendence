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
            <h1 className="text-5xl dark:text-white font-semibold p-5 text-center">Games</h1>
            <GlobalStats user={user} />
            <ShowAchievements user={user} />
            <HistoryElo user={user} />
            <HistoryFive user={user} />
        </>
    );
}

export default StatsUser;
