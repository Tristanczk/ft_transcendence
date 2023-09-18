import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { GatewayModule } from 'src/gateway/gateway.module';

@Module({
    imports: [GatewayModule],
    providers: [FriendsService],
    controllers: [FriendsController],
})
export class FriendsModule {}
