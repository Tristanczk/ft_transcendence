export interface ChannelDto {
	id: number;
	idAdmin: number[];
	idUser: number[];
	name: string;
	isPublic: boolean;
}

export interface ChannelIdDto {
	idChannel: number;
	idUser: number;
}

export interface MuteUserDto {
	idChannel: number;
	idRequester: number;
	idUser: number;
	time: number;
}

export interface MutedUser {
	idUser: number;
	time: number;
}
export interface CreateChannelDto {
	idUser: number[];
	name: string;
	isPublic: boolean;
	password?: string;
}
export interface EditChannelDto {
	id: number;
	idAdmin: number[];
	idUser: number[];
	isPublic: boolean;
	name: string;
	password?: string;
}

export interface EditPasswordDto {
	id: number;
	idRequester: number;
	password: string;
}

export interface EditChannelUserDto {
	id: number;
	idRequester: number;
	idUser: number;
	isBanned?: boolean;
}

export interface EditChannelLeaveDto {
	id: number;
	idRequester: number;
}

export interface EditChannelNameDto {
	id: number;
	idRequester: number;
	name: string;
}
export interface GetChannelDto {
idAdmin: number | undefined;
idUser: number | undefined;
}
export interface JoinChannelDto {
	idUser: number;
	idChannel: number;
	password?: string;
}
export interface CreateMessageDto {
	idChannel: number;
	idSender: number;
	message: string;
}

export interface MessageDto {
	id: number;
	idChannel: number;
	idSender: number;
	message: string;
	createdAt: Date;
}
export interface UserSimplifiedDto {
	id: number;
	nickname: string;
	avatarPath: any;
}
