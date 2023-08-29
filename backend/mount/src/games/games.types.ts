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
	score: number;
}