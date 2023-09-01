import { Exclude } from 'class-transformer';

export class ReturnGamesListDto {
    id: number;
    @Exclude()
    created_at: Date;
    nickname: string;
    @Exclude()
    email: string;
    @Exclude()
    login: string;
    @Exclude()
    hash: string;
    avatarPath: string;
    elo: number;
    @Exclude()
    loginNb: number;
    @Exclude()
    twoFactorAuthentication: boolean;
    isConnected: boolean;
    @Exclude()
    twoFactorSecret: string;
    @Exclude()
    friends: string;
    isYourFriend?: boolean;

    constructor(partial: Partial<ReturnGamesListDto>) {
        Object.assign(this, partial);
    }
}
