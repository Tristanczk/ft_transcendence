import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
    providers: [CreateService, FriendsService],
    controllers: [CreateController],
})
export class CreateModule {}
