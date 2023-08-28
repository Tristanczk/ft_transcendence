import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
	constructor(private prisma: PrismaService) {}

	async createMe() {
		const newGame1 = await this.prisma.games.create({
			data: {
				finished: true,
				finishedAt: new Date(),
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
				finishedAt: new Date(),
				won: false,
				scoreA: 3,
				scoreB: 5,
				mode: 0,
				UserA: {connect: {id: 1}},
				UserB: {connect: {id: 2}},
			}
		});
		const newGame3 = await this.prisma.games.create({
			data: {
				finished: true,
				finishedAt: new Date(),
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
				finishedAt: new Date(),
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
				finishedAt: new Date(),
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
				finishedAt: new Date(),
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
