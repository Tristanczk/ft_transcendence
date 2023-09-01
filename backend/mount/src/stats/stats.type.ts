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
    daysSinceRegister: number;
};

export type DiffDate = {
    sec: number;
    min: number;
    hours: number;
    days: number;
};

export type StatsDashboard = {
    me: UserStats;
    global: GlobalStats;
};

export type UserLeaderboard = {
    avatarPath: string;
    createdAt: Date;
    elo: number;
    id: number;
    isConnected: boolean;
    nickname: string;
    nbGames: number;
};
