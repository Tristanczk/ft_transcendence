export interface CreateMessageDto {
	idChannel: number;
	idSender: number;
	content: string;
}

export interface DeleteMessageDto {
	idChannel: number;
	idSender: number;
	idMessage: number;
}

export interface MessageDto {
	id: number;
	idChannel: number;
	idSender: number;
	content: string;
	createdAt: Date;
}
