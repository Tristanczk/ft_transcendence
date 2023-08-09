import { IsInt, IsString, Length, Max, Min } from "class-validator";

export class CreateChannelDto {
	@IsString()
	@Length(1, 100)
	topic: string;

	@IsString()
	@Length(1, 25)
	name: string;

	@IsString()
	@Length(1, 25)
	admin: string;
}

export class JoinChannelDto {
	@IsString()
	@Length(6, 6)
	channelID: string;

	@IsString()
	@Length(1, 25)
	name: string;
}
