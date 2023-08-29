import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
	constructor(private prisma: PrismaService) {}

	async createMe() {
		const date = new Date()
		const newGame1 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(2022, 9, 5, date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(2022, 9, 5, date.getHours(), date.getMinutes() + 2, date.getSeconds() + 5),
				won: true,
				scoreA: 5,
				scoreB: 4,
				mode: 0,
				UserA: {connect: {id: 1}},
				UserB: {connect: {id: 2}},
			}, 
		});
		const newGame2 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(2023, 7, 21, date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(2023, 7, 21, date.getHours(), date.getMinutes() + 5, date.getSeconds() + 26),
				won: false,
				scoreA: 3,
				scoreB: 5,
				mode: 1,
				UserA: {connect: {id: 1}},
				UserB: {connect: {id: 2}},
			}
		});
		const newGame3 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(2023, 8, 15, date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(2023, 8, 15, date.getHours() + 1, date.getMinutes() + 3, date.getSeconds() + 5),
				won: true,
				scoreA: 6,
				scoreB: 2,
				mode: 0,
				UserA: {connect: {id: 2}},
				UserB: {connect: {id: 1}},
			}
		});
		const newGame4 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 6, date.getSeconds() + 46),
				won: true,
				scoreA: 5,
				scoreB: 4,
				mode: 0,
				UserA: {connect: {id: 1}},
				UserB: {connect: {id: 2}},
			}, 
		});
		const newGame5 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 2, date.getSeconds() + 5),
				won: false,
				scoreA: 3,
				scoreB: 5,
				mode: 0,
				UserA: {connect: {id: 1}},
				UserB: {connect: {id: 2}},
			}
		});
		const newGame6 = await this.prisma.games.create({
			data: {
				finished: true,
				createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
				finishedAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 0, date.getSeconds() + 51),
				won: true,
				scoreA: 6,
				scoreB: 2,
				mode: 0,
				UserA: {connect: {id: 2}},
				UserB: {connect: {id: 1}},
			}
		});

		return ;
	}

	async getMe() {
		const data = await this.prisma.user.findUnique({
			where: {
				id: 1,
			},
			include: {
				gamesasPlayerA: true,
				gamesasPlayerB: true,
			}
		})
		console.log('data1=')
		console.log(data)

		const data2 = await this.prisma.user.findUnique({
			where: {
				id: 2,
			},
			include: {
				gamesasPlayerA: true,
				gamesasPlayerB: true,
			}
		})
		console.log('data2=')
		console.log(data2)
		return data;
	}
}
