import { Controller, UseGuards, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/decorator';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
	constructor(private friendService: FriendsService) {}

	@Get('possiblefriends')
    getPossibleFriends(@GetUser('id') userId: number): Promise<GetAllUsersResponseDto[]> {
        return this.friendService.getAllPossibleFriends(userId);
    }

	@Get('me')
    getMe(@GetUser('id') userId: number) {
        return this.friendService.getAllMyFriends(userId);
    }

	@Post(':id')
	postFriend(@GetUser('id') userId: number, @Param('id', ParseIntPipe) userToAdd: number) {
		return this.friendService.addNewFriend(userId, userToAdd);
	}
}

/*
ENDPOINTS dans friends:
GET friends/me	: retourne tous mes amis
GET friends/possiblefriends : retourne toutes les personnes pouvant etre mes amis
POST friends/:id : ajoute l'id a mes amis (verif si pas deja mon amis)
*/