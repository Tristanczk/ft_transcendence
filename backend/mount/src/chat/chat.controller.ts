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
import {
    ChannelDto,
    ChannelIdDto,
    CreateChannelDto,
    CreateMessageDto,
    EditChannelDto,
    EditChannelLeaveDto,
    EditChannelNameDto,
    EditChannelUserDto,
    EditPasswordDto,
    GetChannelDto,
    JoinChannelDto,
    MessageDto,
    MuteUserDto,
    UserSimplifiedDto,
} from './dto/channel.dto';

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
        return this.chatService.getChannelByUsers(getChannel);
    }

    @Get('getChannelUsers')
    async getChannelUsers(
        @Query() getChannel: ChannelIdDto,
    ): Promise<UserSimplifiedDto[] | null> {
        return this.chatService.getChannelUsers(getChannel.idChannel);
    }

    @Get('isChannelOpen')
    async isChannelOpen(@Query() getChannel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isChannelOpen(getChannel.idChannel);
    }

    @Get('isChannelAdmin')
    async isChannelAdmin(@Query() channel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isChannelAdmin(channel);
    }

    @Get('isUserBanned')
    async isUserBanned(@Query() channel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isUserBanned(channel);
    }

    @Get('isUserInChannel')
    async isUserInChannel(@Query() channel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isUserInChannel(channel);
    }

    @Post('joinChannel')
    async joinChannel(@Body() joinChannel: JoinChannelDto): Promise<boolean> {
        return this.chatService.joinChannel(joinChannel);
    }

    @Patch('leaveChannel')
    async leaveChannel(@Body() leaveChannel: EditChannelLeaveDto) {
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
    ): Promise<EditChannelDto | string> {
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
    ): Promise<EditChannelDto | string> {
        return this.chatService.addAdmin(editChannel);
    }

    @Patch('muteUser')
    async muteUser(
        @Body() editChannel: MuteUserDto,
    ): Promise<EditChannelDto | string> {
        return this.chatService.muteUser(editChannel);
    }

    @Get('isUserMuted')
    async isUserMuted(@Query() editChannel: ChannelIdDto): Promise<boolean> {
        return this.chatService.isUserMuted(editChannel);
    }

    @Post('sendMessage')
    async sendMessage(
        @Body() message: CreateMessageDto,
    ): Promise<CreateMessageDto> {
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
