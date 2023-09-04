import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import { CreateMessageDto, DeleteMessageDto, MessageDto } from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { LeaveChannelDto } from './dto/leavechannel.dto';
import { ChannelDto } from './dto/channel.dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}
	
	@Post('createChannel')
	async createChannel(@Body() createChannelDto: CreateChannelDto) : Promise<CreateChannelDto> {
		console.log("createChannnel controller");
		console.log(createChannelDto);
		return this.chatService.createChannel(createChannelDto);
	}
	
	@Get('getChannels')
	async getChannels(@Body() idUser: number) : Promise<ChannelDto[] | null>{
		console.log("getChannels controller " + idUser);
		return this.chatService.getChannels(idUser);
	}

	@Get(':id')
	async getChannelById(@Param('id', ParseIntPipe) channelId: number) {
		return this.chatService.getChannelById(channelId);
	}

	@Post('joinChannel')
	async joinChannel(@Body() joinChannel: JoinChannelDto) {
		return this.chatService.joinChannel(joinChannel);
	}

	@Post('leaveChannel')
	async leaveChannel(@Body() leaveChannel: LeaveChannelDto) {
		return this.chatService.leaveChannel(leaveChannel);
	}

	@Patch('editChannel')
	async editChannel(@Body() idUser: number, editChannel: EditChannelDto): Promise<EditChannelDto> {
		return this.chatService.editChannel(idUser, editChannel);
	}

	@Post('sendMessage')
	async sendMessage(@Body() message: CreateMessageDto) {
		return this.chatService.sendMessage(message);
	}

	@Patch('deleteMessage')
	async deleteMessage(@Body() idUser:number, message: DeleteMessageDto) {
		return this.chatService.deleteMessage(idUser, message);
	}

	@Get('getMessages/:id')
	async getMessages(@Param('id', ParseIntPipe) channelId: number, @Body() idUser:number): Promise<MessageDto[] | null> {
		return this.chatService.getMessages(channelId, idUser);
	}
}
