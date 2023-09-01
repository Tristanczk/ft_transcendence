import {
    Controller,
    UseGuards,
    Get,
    Post,
    Param,
    ParseIntPipe,
    Delete,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/decorator';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';

@Controller('friends')
export class FriendsController {
    constructor(private friendService: FriendsService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMyFriends(
        @GetUser('id') userId: number,
    ): Promise<GetAllUsersResponseDto[]> {
        return this.friendService.getAllFriends(userId);
    }

    @Get(':id')
    getFriends(
        @Param('id', ParseIntPipe) userId: number,
    ): Promise<GetAllUsersResponseDto[]> {
        return this.friendService.getAllFriends(userId);
    }

    @UseGuards(JwtGuard)
    @Get('select/:nick')
    getListFriendChoice(
        @GetUser('id') userId: number,
        @Param('nick') nick: string,
    ) {
        return this.friendService.getListFriendChoice(userId, nick);
    }

    @UseGuards(JwtGuard)
    @Post(':id')
    postFriend(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) userToAdd: number,
    ) {
        return this.friendService.addNewFriend(userId, userToAdd);
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteFriend(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) userToDelete: number,
    ) {
        return this.friendService.deleteFriend(userId, userToDelete);
    }
}

/*
ENDPOINTS dans friends:
GET friends/me	: retourne tous mes amis
GET friends/possiblefriends : retourne toutes les personnes pouvant etre mes amis
POST friends/:id : ajoute l'id a mes amis (verif si pas deja mon amis)
*/
