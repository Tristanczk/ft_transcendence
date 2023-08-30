import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { ErrorsService } from 'src/errors/errors.service';

@Module({
    providers: [FriendsService, ErrorsService],
    controllers: [FriendsController],
})
export class FriendsModule {}
