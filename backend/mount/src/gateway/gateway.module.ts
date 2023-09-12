import { Global, Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
    imports: [ScheduleModule.forRoot()],
    controllers: [GatewayController],
    providers: [GatewayService],
    exports: [GatewayService],
})
export class GatewayModule {}
