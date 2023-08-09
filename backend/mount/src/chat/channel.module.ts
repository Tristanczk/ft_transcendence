import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

// Channel Module, regroup all channel functionalities
@Module({
	imports: [ConfigModule],
	controllers: [ChannelController],
	providers: [ChannelService],
})
export class ChannelModule {}
