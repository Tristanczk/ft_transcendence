export interface ChannelDto {
	id: number;
	name: string;
	isPublic: boolean;
}

export interface ChannelIdDto {
	idChannel: number;
}

export interface isChannelAdminDto {
	idChannel: number;
	idUser: number;
}