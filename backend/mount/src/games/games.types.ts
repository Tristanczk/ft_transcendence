export type GameExports = {
	gameId: number;
	duration: number;
	mode: number;
	playerA: UserGame | null;
	playerB: UserGame | null;
}

export type UserGame = {
	id: number;
	nickname: string,
	elo: number;
	score: number;
}