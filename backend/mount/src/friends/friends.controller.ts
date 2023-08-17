import { Controller, UseGuards, Get, Body } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
	constructor(private friendService: FriendsService) {}

	@Get('me')
    getMe(@GetUser('id') userId: number) {
        return this.friendService.getAllMyFriends(userId);
    }
}

/*
ENDPOINTS dans friends:
GET friends/me	: retourne tous mes amis

*/