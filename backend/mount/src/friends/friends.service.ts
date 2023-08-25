import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FriendsJson } from './friends.type';

@Injectable()
export class FriendsService {
    constructor(private prisma: PrismaService) {}

    async getAllMyFriends(userId: number): Promise<GetAllUsersResponseDto[]> {
		const users = await this.prisma.user.findMany();
		const me = await this.prisma.user.findUnique({where:{id: userId}})
		if (!me) {
			throw new NotFoundException(`User with ${userId} not found`)
		}
		const list: FriendsJson[] = JSON.parse(me.friends)

		const friendsAdapted = list.flatMap((friend) => [
            friend.idFriend !== userId ? friend.idFriend : null
		]);
		console.log(friendsAdapted);
        return users
            .filter((user) => user.id !== userId)
            .filter((user) => friendsAdapted.includes(user.id))
            .map((user) => new GetAllUsersResponseDto(user));
    }

    async addNewFriend(userId: number, userNewFriend: number) {
		const me = await this.prisma.user.findUnique({where:{id: userId}})
		if (!me) {
			throw new NotFoundException(`User with ${userId} not found`)
		}
		try {
			const list: FriendsJson[] = JSON.parse(me.friends)
			list.push({idFriend: userNewFriend, createdAt: Date.now()})
			const data: string = JSON.stringify(list)
			const retour = await this.prisma.user.update({where: {id: me.id}, data: {friends: data}})
			if (!retour) {
				throw new BadRequestException(`Error updating database`)
			}
		}
		catch (error) {
			throw new InternalServerErrorException(`Servor error`)
		}
    }

    async deleteFriend(userId: number, friendToDelete: number) {
		const me = await this.prisma.user.findUnique({where:{id: userId}})
		if (!me) {
			throw new NotFoundException(`User with ${userId} not found`)
		}
		try {
			const list: FriendsJson[] = JSON.parse(me.friends)
			const indexFound: number = list.findIndex((friend) => friend.idFriend === friendToDelete)
			if (indexFound === -1) {
				throw new NotFoundException(`Not a friend`)
			}
			list.splice(indexFound, 1)
			const data: string = JSON.stringify(list);
			const retour = await this.prisma.user.update({where: {id: me.id}, data: {friends: data}})
			if (!retour) {
				throw new BadRequestException(`Error updating database`)
			}
		}
		catch (error) {
			throw new InternalServerErrorException(`Servor error`)
		}
    }

	async getListFriendChoice(userId: number, nick: string) {
		// console.log('trying')
		const me = await this.prisma.user.findUnique({where:{id: userId}})
		if (!me) {
			throw new NotFoundException(`User with ${userId} not found`)
		}
		const list: FriendsJson[] = JSON.parse(me.friends);
		const friendsAdapted = list.flatMap((friend) => [
            friend.idFriend !== userId ? friend.idFriend : null
		]);
		const friendsList = await this.prisma.user.findMany({
			take: 5,
			orderBy: {
				nickname: 'asc',
			},
			where: {
				nickname: {
					startsWith: nick
				},
			}
		});
		// if (friendsList) {
		// 	console.log(friendsList)
		// 	friendsList.filter((user) => user.id !== userId)
		// 	const newData = friendsList.map((user) => ({
		// 		...user,
		// 		isYourFriend: friendsAdapted.includes(user.id) ? true : false,
		// 	}))
		// }
			
		return friendsList
			.filter((user) => user.id !== userId)
			.map((user) => ({
				...user,
				isYourFriend: friendsAdapted.includes(user.id) ? true : false,
			}))
            .map((user) => new GetAllUsersResponseDto(user));
	}
}
