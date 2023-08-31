export interface EditChannelDto {
	id: number;
	idAdmin: number[];
	idUser: number[];
	isPublic: boolean;
	name: string;
	password?: string;
}
