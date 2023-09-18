export type GameExports = {
    gameId: number;
    date: Date;
    duration: number;
    finished: boolean;
    mode: number;
    won: boolean;
    aborted: boolean;
    playerA: UserGame | null;
    playerB: UserGame | null;
};

export type UserGame = {
    id: number;
    nickname: string;
    elo: number;
    eloStart: number;
    score: number;
};

export type GameExtractedDB = {
    id: number;
    createdAt: Date;
    finishedAt: Date;
    finished: boolean;
    won: boolean;
    scoreA: number;
    scoreB: number;
    mode: number;
    varEloA: number;
    varEloB: number;
    initEloA: number;
    initEloB: number;
    playerA: number;
    playerB: number;
};

export type AchievType = {
    id: string;
    title: string;
    description: string;
	userHave: boolean;
};

export const dataAchievements: AchievType[] = [
    {
        id: 'classic-1',
        title: 'Playing I',
        description: 'Played 1 game in classic mode',
		userHave: false,
    },
    {
        id: 'classic-5',
        title: 'Playing II',
        description: 'Played 5 games in classic mode',
		userHave: false,
    },
    {
        id: 'classic-win-1',
        title: 'Winning I',
        description: 'Won 1 game in classic mode',
		userHave: false,
    },
    {
        id: 'classic-win-5',
        title: 'Winning II',
        description: 'Won 5 games in classic mode',
		userHave: false,
    },
    {
        id: 'classic-boss',
        title: 'Perfect game',
        description: 'Won a game 7-0 in classic mode',
		userHave: false,
    },
    {
        id: 'classic-win-time',
        title: 'The Flash',
        description: 'Won a game in less than a minute in classic mode',
		userHave: false,
    },
    {
        id: 'classic-1100',
        title: 'Level up I',
        description: 'Reached 1100 elo in classic mode',
		userHave: false,
    },
    {
        id: 'classic-1200',
        title: 'Level up II',
        description: 'Reached 1200 elo in classic mode',
		userHave: false,
    },
    {
        id: 'classic-marathon',
        title: 'Marathon',
        description: 'Played a game with more than 30 points',
		userHave: false,
    },
];
