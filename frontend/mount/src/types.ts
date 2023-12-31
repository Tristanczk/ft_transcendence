export type User = {
    id: number;
    nickname: string;
    createdAt: Date;
    email: string;
    elo: number;
    loginNb: number;
    twoFactorAuthentication: boolean;
    achievements: string[];
    updateAvatar: undefined | boolean;
};

export type UserSimplified = {
    id: number;
    createdAt: Date;
    nickname: string;
    elo: number;
    avatarPath: any;
    isConnected: boolean;
    isPlaying: boolean;
    isYourFriend?: boolean;
};

export type Friends = {
    id: number;
    createdAt: Date;
    idUserA: number;
    idUserB: number;
};

export type Games = {
    id: number;
    startedAt: Date;
    finishedAt: Date;
    finished: boolean;
    won: boolean;
    scoreA: number;
    scoreB: number;
    playerA: number;
    playerB: number;
};

export type GameImports = {
    gameId: number;
    date: Date;
    duration: number;
    finished: boolean;
    mode: number;
    won: boolean;
    aborted: boolean;
    playerA: UserGame;
    playerB: UserGame;
};

export type UserGame = {
    id: number;
    nickname: string;
    elo: number;
    eloStart: number;
    score: number;
};

//stats
export type GlobalStats = {
    nbGames: number;
    nbUsers: number;
    averageElo: number;
};

export type UserStats = {
    nbGames: number;
    nbWins: number;
    averageDuration: number;
    elo: number;
	highElo: number;
	averageEloOpponents: number;
    daysSinceRegister: number;
};

export type StatsDashboard = {
    me: UserStats;
    global: GlobalStats;
};
