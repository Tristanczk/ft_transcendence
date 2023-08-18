export type User = {
    id: number;
    nickname: string;
    email: string;
    elo: number;
    loginNb: number;
    twoFactorAuthentication: boolean;
};

export type UserSimplified = {
    id: number;
	created_at: Date;
    nickname: string;
    elo: number;
	avatarPath: any;
};

export type Friends = {
    id: number;
	createdAt: Date;
	idUserA: number;
	idUserB: number;
}
