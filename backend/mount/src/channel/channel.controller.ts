import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/channel.dto';

@UseGuards(JwtGuard)
@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService) {

	@Post('create')
	createChannel(@GetUser('id') userId: number, @Body() createChannelDto: CreateChannelDto) {
		return this.channelService.createChannel();
	};

	@Post('join')
	joinChannel(@GetUser('id') userId: number, @Body() joinChannelDto: JoinChannelDto) {
		return this.channelService.joinChannel();
	}
		
}
