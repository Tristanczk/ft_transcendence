import { Injectable } from '@nestjs/common';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService) {}

    async getAllMyFriends(userId: number): Promise<GetAllUsersResponseDto[]> {
        const users = await this.prisma.user.findMany();
        const friends = await this.prisma.friends.findMany({
            where: {
                OR: [{ idUserA: userId }, { idUserB: userId }],
            },
        });
        const friendsAdapted = friends.flatMap((friend) => [
            friend.idUserA !== userId ? friend.idUserA : null,
            friend.idUserB !== userId ? friend.idUserB : null,
        ]);
        return users
            .filter((user) => user.id !== userId)
            .filter((user) => friendsAdapted.includes(user.id))
            .map((user) => new GetAllUsersResponseDto(user));
    }

    async getAllPossibleFriends(
        userId: number,
    ): Promise<GetAllUsersResponseDto[]> {
        const users = await this.prisma.user.findMany();
        const friends = await this.prisma.friends.findMany({
            where: {
                OR: [{ idUserA: userId }, { idUserB: userId }],
            },
        });
        const friendsAdapted = friends.flatMap((friend) => [
            friend.idUserA !== userId ? friend.idUserA : null,
            friend.idUserB !== userId ? friend.idUserB : null,
        ]);
        return users
            .filter((user) => user.id !== userId)
            .filter((user) => !friendsAdapted.includes(user.id))
            .map((user) => new GetAllUsersResponseDto(user));
    }

    async addNewFriend(userId: number, userNewFriend: number) {
        //verif friends pas deja dans mes amis
        const isFriend = await this.prisma.friends.findFirst({
            where: {
                OR: [
                    { idUserA: userId, idUserB: userNewFriend },
                    { idUserA: userNewFriend, idUserB: userId },
                ],
            },
        });

        if (isFriend) return 'already a friend';
        //si ok, ajout
        const newFriend = await this.prisma.friends.create({
            data: {
                idUserA: userId,
                idUserB: userNewFriend,
            },
        });
        return 'friend added';
    }

    async deleteFriend(userId: number, friendToDelete: number) {
        //verif friends est bien dans mes amis
        const isFriend = await this.prisma.friends.findFirst({
            where: {
                OR: [
                    { idUserA: userId, idUserB: friendToDelete },
                    { idUserA: friendToDelete, idUserB: userId },
                ],
            },
        });
        if (!isFriend) return 'not a friend';
        const newFriend = await this.prisma.friends.delete({
            where: { id: isFriend.id },
        });
        return 'friend deleted';
    }
}
