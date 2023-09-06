import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FriendsJson } from './friends.type';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService) {}

    async getAllFriends(userId: number): Promise<GetAllUsersResponseDto[]> {
        const users = await this.prisma.user.findMany();
        const me = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!me) {
            throw new NotFoundException(`User with ${userId} not found`);
        }
        const list: FriendsJson[] = JSON.parse(me.friends);

        const friendsAdapted = list.flatMap((friend) => [
            friend.idFriend !== userId ? friend.idFriend : null,
        ]);
        return users
            .filter((user) => user.id !== userId)
            .filter((user) => friendsAdapted.includes(user.id))
            .map((user) => new GetAllUsersResponseDto(user));
    }

    async addNewFriend(userId: number, userNewFriend: number) {
        try {
            await this.addFriendListUser(userId, userNewFriend);
            await this.addFriendListUser(userNewFriend, userId);
        } catch (error) {
            throw error;
        }
    }

    async addFriendListUser(userId: number, newFriendId: number) {
        try {
            const me = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!me)
                throw new NotFoundException(`User with ${userId} not found`);
            const list: FriendsJson[] = JSON.parse(me.friends);
            list.push({ idFriend: newFriendId, createdAt: Date.now() });
            const data: string = JSON.stringify(list);
            const retour = await this.prisma.user.update({
                where: { id: me.id },
                data: { friends: data },
            });
            if (!retour) {
                throw new BadRequestException(`Error updating database`);
            }
        } catch (error) {
            return ;
        }
    }

    async deleteFriend(userId: number, friendToDelete: number) {
        try {
            await this.deleteFriendFromList(userId, friendToDelete);
            await this.deleteFriendFromList(friendToDelete, userId);
        } catch (error) {
            throw error;
        }
    }

    async deleteFriendFromList(userId: number, friendToDelete: number) {
        try {
            const me = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!me) {
                throw new NotFoundException(`User with ${userId} not found`);
            }
            const list: FriendsJson[] = JSON.parse(me.friends);
            const indexFound: number = list.findIndex(
                (friend) => friend.idFriend === friendToDelete,
            );
            if (indexFound === -1) {
                throw new NotFoundException(`Not a friend`);
            }
            list.splice(indexFound, 1);
            const data: string = JSON.stringify(list);
            const retour = await this.prisma.user.update({
                where: { id: me.id },
                data: { friends: data },
            });
            if (!retour) {
                throw new BadRequestException(`Error updating database`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getListFriendChoice(userId: number, nick: string) {
        // console.log('trying')
        const me = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!me) {
            throw new NotFoundException(`User with ${userId} not found`);
        }
        const list: FriendsJson[] = JSON.parse(me.friends);
        const friendsAdapted = list.flatMap((friend) => [
            friend.idFriend !== userId ? friend.idFriend : null,
        ]);
        const friendsList = await this.prisma.user.findMany({
            take: 5,
            orderBy: {
                nickname: 'asc',
            },
            where: {
                nickname: {
                    startsWith: nick,
                },
            },
        });

        return friendsList
            .filter((user) => user.id !== userId)
            .map((user) => ({
                ...user,
                isYourFriend: friendsAdapted.includes(user.id) ? true : false,
            }))
            .map((user) => new GetAllUsersResponseDto(user));
    }
}
