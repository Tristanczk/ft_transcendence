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
