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
import {
    EditChannelDto,
    EditChannelLeaveDto,
    EditChannelNameDto,
    EditChannelUserDto,
    EditPasswordDto,
} from './dto/editchannel.dto';
import {
    CreateMessageDto,
    MessageDto,
} from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { ChannelDto, ChannelIdDto } from './dto/channel.dto';
import { GetChannelDto } from './dto/getchannel.dto';
import { UserSimplifiedDto } from './dto/usersimplifieddto';

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

    @Get('getChannelUsers')
    async getChannelUsers(
        @Query() getChannel: ChannelIdDto,
    ): Promise<UserSimplifiedDto[] | null> {
        console.log('getChannelUsers controller');
        console.log(getChannel);
        return this.chatService.getChannelUsers(getChannel.idChannel);
    }

    @Get('isChannelOpen')
    async isChannelOpen(@Query() getChannel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isChannelOpen(getChannel.idChannel);
    }

    @Get('isChannelAdmin')
    async isChannelAdmin(@Query() channel: ChannelIdDto): Promise<boolean> {
        console.log('isChannelAdmin controller');
        console.log(channel);
        return this.chatService.isChannelAdmin(channel);
    }

    @Get('isUserInChannel')
    async isUserInChannel(@Query() channel: ChannelIdDto): Promise<boolean> {
        console.log('isUserInChannel controller');
        console.log(channel);
        return this.chatService.isUserInChannel(channel);
    }

    @Post('joinChannel')
    async joinChannel(@Body() joinChannel: JoinChannelDto): Promise<boolean> {
        return this.chatService.joinChannel(joinChannel);
    }

    @Patch('leaveChannel')
    async leaveChannel(@Body() leaveChannel: EditChannelLeaveDto) {
        console.log('leaveChannel controller');
        console.log(leaveChannel);
        return this.chatService.leaveChannel(leaveChannel);
    }

    @Patch('editPassword')
    async editPassword(
        @Body() editChannel: EditPasswordDto,
    ): Promise<EditChannelDto> {
        return this.chatService.editPassword(editChannel);
    }

    @Patch('banUser')
    async banUser(
        @Body() editChannel: EditChannelUserDto,
    ): Promise<EditChannelDto> {
        return this.chatService.banUser(editChannel);
    }

    @Patch('editName')
    async editName(
        @Body() editChannel: EditChannelNameDto,
    ): Promise<EditChannelDto> {
        return this.chatService.editName(editChannel);
    }

    @Patch('addAdmin')
    async addAdmin(
        @Body() editChannel: EditChannelUserDto,
    ): Promise<EditChannelDto> {
        return this.chatService.addAdmin(editChannel);
    }

    @Patch('muteUser')
    async muteUser(
        @Body() editChannel: EditChannelUserDto,
    ): Promise<EditChannelDto> {
        return this.chatService.muteUser(editChannel);
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

    @Get('getMessages/:id')
    async getMessages(
        @Param('id', ParseIntPipe) channelId: number,
        @Body() idUser: number,
    ): Promise<MessageDto[] | null> {
        return this.chatService.getMessages(channelId, idUser);
    }
}
