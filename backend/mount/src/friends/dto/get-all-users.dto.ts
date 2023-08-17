import { Exclude } from "class-transformer";

export class GetAllUsersResponseDto {
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
    elo: number;
	@Exclude()
    loginNb: number;
	@Exclude()
    twoFactorAuthentication: boolean;

	constructor(partial: Partial<GetAllUsersResponseDto>) {
		Object.assign(this, partial)
	}
}
