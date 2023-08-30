import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(createChannelDto: CreateChannelDto) {}

	async getChannelById(channelId: number) {}

	async joinChannel() {}

	async leaveChannel() {}

	async editChannel(editChannel: EditChannelDto) {}

	async createMessage(message: MessageDto) {}
}
