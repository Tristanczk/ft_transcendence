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
