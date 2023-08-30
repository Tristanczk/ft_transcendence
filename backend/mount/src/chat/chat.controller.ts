import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import { MessageDto } from './dto/message.dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Post('createChannel')
	async createChannel(createChannelDto: CreateChannelDto) {
		return this.chatService.createChannel(createChannelDto);
	}

	@Get(':id')
	async getChannelById(@Param('id', ParseIntPipe) channelId: number) {
		return this.chatService.getChannelById(channelId);
	}

	@Post('joinChannel')
	async joinChannel() {
		return this.chatService.joinChannel();
	}

	@Post('leaveChannel')
	async leaveChannel() {
		return this.chatService.leaveChannel();
	}

	@Patch('editChannel')
	async editChannel(editChannel: EditChannelDto) {
		return this.chatService.editChannel(editChannel);
	}

	@Post('createMessage')
	async createMessage(@Body() message: MessageDto) {
		return this.chatService.createMessage(message);
	}
}
