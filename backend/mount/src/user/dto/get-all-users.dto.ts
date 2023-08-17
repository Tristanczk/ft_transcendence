import { Exclude } from "class-transformer";

export class GetAllUsersResponseDto {
	id: number;
    nickname: string;
	@Exclude()
    email: string;
    elo: number;
	@Exclude()
    loginNb: number;
	@Exclude()
    twoFactorAuthentication: boolean;

	constructor(partial: Partial<GetAllUsersResponseDto>) {
		Object.assign(this, partial)
	}
}
