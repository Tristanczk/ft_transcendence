import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import {
    CreateMessageDto,
    DeleteMessageDto,
    MessageDto,
} from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { LeaveChannelDto } from './dto/leavechannel.dto';
import { ChannelDto, ChannelIdDto, isChannelAdminDto } from './dto/channel.dto';
import { query } from 'express';
import { GetChannelDto } from './dto/getchannel.dto';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Post('createChannel')
    async createChannel(
        @Body() createChannelDto: CreateChannelDto,
    ): Promise<CreateChannelDto> {
        return this.chatService.createChannel(createChannelDto);
    }

    @Get('getChannels')
    async getChannels(): Promise<ChannelDto[] | null> {
        return this.chatService.getChannels();
    }

    @Get('getChannelById')
    async getChannel(
        @Query() channel: ChannelIdDto,
    ): Promise<ChannelDto | null> {
        return this.chatService.getChannel(channel.idChannel);
    }

    @Get('getChannelByUsers')
    async getChannelByUsers(
        @Query() getChannel: GetChannelDto,
    ): Promise<ChannelDto | null> {
        console.log('getChannelByUsers controller');
        return this.chatService.getChannelByUsers(getChannel);
    }

	@Get('isChannelOpen')
	async isChannelOpen(@Query() getChannel: ChannelIdDto): Promise<boolean> {
		return this.chatService.isChannelOpen(getChannel.idChannel);
	}

	@Get('isChannelAdmin')
	async isChannelAdmin(@Body() channel: isChannelAdminDto): Promise<boolean> {
		return this.chatService.isChannelAdmin(channel);
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
    async editChannel(
        @Body() idUser: number,
        editChannel: EditChannelDto,
    ): Promise<EditChannelDto> {
        return this.chatService.editChannel(idUser, editChannel);
    }

    @Post('sendMessage')
    async sendMessage(
        @Body() message: CreateMessageDto,
    ): Promise<CreateMessageDto> {
        console.log(
            'sendMessage controller' +
                message.idChannel +
                ' ' +
                message.idSender +
                ' ' +
                message.message,
        );
        return this.chatService.sendMessage(message);
    }

    @Patch('deleteMessage')
    async deleteMessage(@Body() idUser: number, message: DeleteMessageDto) {
        return this.chatService.deleteMessage(idUser, message);
    }

    @Get('getMessages/:id')
    async getMessages(
        @Param('id', ParseIntPipe) channelId: number,
        @Body() idUser: number,
    ): Promise<MessageDto[] | null> {
        return this.chatService.getMessages(channelId, idUser);
    }
}
