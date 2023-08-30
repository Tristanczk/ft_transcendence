import { User } from '../../types';
import React from 'react';
import GlobalStats from '../stats/GlobalStats';
import HistoryFive from '../stats/HistoryFive';
import HistoryElo from '../stats/HistoryElo';

interface PresentationUserProps {
    user: User;
}

function StatsUser({ user }: PresentationUserProps) {
    return (
        <>
            <h1 className="text-5xl font-extrabold dark:text-white">Games</h1>
            <GlobalStats />
            <HistoryElo />
            <HistoryFive />
        </>
    );
}

export default StatsUser;
