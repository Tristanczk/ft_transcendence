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