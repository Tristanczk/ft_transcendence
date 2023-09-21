import { Games } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class LeaderbordResponseDto {
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
    @Exclude()
    isYourFriend?: boolean;
    @Exclude()
    achievements: String[];
    @Exclude()
    gamesasPlayerA: Games[];
    @Exclude()
    gamesasPlayerB: Games[];

    constructor(partial: Partial<LeaderbordResponseDto>) {
        Object.assign(this, partial);
    }
}
