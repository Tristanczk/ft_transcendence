import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GamesService } from 'src/games/games.service';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [GatewayController],
    providers: [GatewayService, GamesService],
})
export class GatewayModule {}
