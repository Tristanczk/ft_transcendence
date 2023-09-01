export type GameExports = {
	gameId: number;
	date: Date;
	duration: number;
	mode: number;
	won: boolean;
	playerA: UserGame | null;
	playerB: UserGame | null;
}

export type UserGame = {
	id: number;
	nickname: string,
	elo: number;
	eloStart: number;
	score: number;
}

export type GameExtractedDB = {
	id: 		number;
    createdAt:  Date
    finishedAt: Date
    finished:   boolean
    won:   		boolean
    scoreA: 	number
    scoreB: 	number
	mode: 		number
	varEloA: 	number
	varEloB: 	number
	initEloA: 	number
	initEloB: 	number
	playerA: 	number
	playerB: 	number
}

export type AchievType = {
	id: string,
	title: string,
	description: string,
}

export const dataAchievements: AchievType[] = [
	{
		id: 'classic-1',
		title: 'Playing',
		description: 'Played 1 game in classic mode'
	},
	{
		id: 'classic-5',
		title: 'Playing',
		description: 'Played 5 games in classic mode'
	},
	{
		id: 'classic-win-1',
		title: 'Winning',
		description: 'Won 1 game in classic mode'
	},
	{
		id: 'classic-win-5',
		title: 'Winning',
		description: 'Won 5 games in classic mode'
	},
	{
		id: 'classic-boss',
		title: 'Winning',
		description: 'Won a game 7-0 in classic mode'
	},
	{
		id: 'classic-win-time',
		title: 'Time winning',
		description: 'Won a game in less than a minute in classic mode'
	},
	{
		id: 'classic-1100',
		title: 'Level up',
		description: 'Reached 1100 elo in classic mode'
	},
	{
		id: 'classic-1200',
		title: 'Level up',
		description: 'Reached 1200 elo in classic mode'
	},
	{
		id: 'classic-marathon',
		title: 'Playing',
		description: 'Played a game with more than 30 points'
	},
]
