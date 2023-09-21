import { Global, Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GamesService } from 'src/games/games.service';

@Global()
@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [GatewayController],
    exports: [GatewayService],
    providers: [GatewayService, GamesService],
})
export class GatewayModule {}
