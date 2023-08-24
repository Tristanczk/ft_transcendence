export type User = {
    id: number;
    nickname: string;
    email: string;
    elo: number;
    loginNb: number;
    twoFactorAuthentication: boolean;
};

export type Friends = {
    id: number;
	createdAt: Date;
	idUserA: number;
	idUserB: number;
}
