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
