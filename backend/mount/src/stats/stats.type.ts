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
	sec: number,
	min: number;
	hours: number,
	days: number,
}

export type StatsDashboard = {
	me: UserStats;
	global: GlobalStats;
}