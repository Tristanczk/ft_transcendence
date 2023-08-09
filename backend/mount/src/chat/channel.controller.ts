import { Body, Controller, Post } from '@nestjs/common';
import { CreateChannelDto, JoinChannelDto } from './dto/channel.dto';
import { ChannelService } from './channel.service';
import { PrismaService } from 'src/prisma/prisma.service';

// Channel Controller, reroute the request body to the services functions
@Controller('chat')
export class ChannelController {
    constructor(
        private channelService: ChannelService,
        private prisma: PrismaService,
    ) {}

    @Post()
    async create(@Body() createPollDto: CreateChannelDto) {
        const result = await this.channelService.createChannel(createPollDto);

        return result;
    }

    @Post('/join')
    async join(@Body() joinChannelDto: JoinChannelDto) {
        const result = await this.channelService.joinChannel(joinChannelDto);

        return result;
    }

    @Post('/rejoin')
    async rejoin() {
        return;
    }
}
