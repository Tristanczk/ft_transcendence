import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [GatewayController],
    providers: [GatewayService],
})
export class GatewayModule {}
