export interface CreateChannelDto {
	idUser: number[];
	name: string;
	isPublic: boolean;
	password?: string;
}
