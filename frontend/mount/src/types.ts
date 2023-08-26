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
};

export type Friends = {
    id: number;
    createdAt: Date;
    idUserA: number;
    idUserB: number;
};
