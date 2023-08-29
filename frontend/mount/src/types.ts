export type User = {
    id: number;
    nickname: string;
    createdAt: Date;
    email: string;
    elo: number;
    loginNb: number;
    twoFactorAuthentication: boolean;
};

export type UserSimplified = {
    id: number;
    createdAt: Date;
    nickname: string;
    elo: number;
    avatarPath: any;
    isConnected: boolean;
	isYourFriend?: boolean;
};

export type Friends = {
    id: number;
    createdAt: Date;
    idUserA: number;
    idUserB: number;
};

export type Games = {
	id: 		number;
	startedAt: 	Date;
	finishedAt:	Date;
	finished:	boolean;
    won:		boolean;
    scoreA: 	number;
    scoreB: 	number;
	playerA:	number;
	playerB:	number;
}

export type GameImports = {
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