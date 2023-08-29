import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from 'src/games/games.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiffDate, GlobalStats, UserStats } from './stats.type';

@Injectable()
export class StatsService {
    constructor(
        private prisma: PrismaService,
        private gameService: GamesService,
    ) {}

    async getStatsUser(idUser: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: idUser },
            include: {
                gamesasPlayerA: true,
                gamesasPlayerB: true,
            },
        });
        if (!user) throw new NotFoundException('No user found');

        const gameList = user.gamesasPlayerA.concat(user.gamesasPlayerB);
        gameList.sort((a, b) => a.id - b.id);

        const userStats: UserStats = {
            nbGames: gameList.length,
            nbWins:
                user.gamesasPlayerA.reduce(
                    (acc, curr) => acc + (curr.won ? 1 : 0),
                    0,
                ) +
                user.gamesasPlayerB.reduce(
                    (acc, curr) => acc + (curr.won ? 1 : 0),
                    0,
                ),
            averageDuration:
                Math.trunc(gameList.reduce(
                    (acc, curr) =>
                        acc +
                        this.gameService.computeDuration(
                            curr.createdAt,
                            curr.finishedAt,
                        ),
                    0,
                ) / gameList.length),
            elo: user.elo,
            daysSinceRegister: this.dateDiff(user.createdAt, new Date()).days,
        };

		// console.log(userStats)
		

        return userStats;
    }

	dateDiff(date1, date2): DiffDate {
		var diff: DiffDate = {sec: 0, min:0, hours:0, days: 0}
		var tmp = date2 - date1;
		
		tmp = Math.floor(tmp/1000);
		diff.sec = tmp % 60;
		
		tmp = Math.floor((tmp-diff.sec)/60);
		diff.min = tmp % 60;
		
		tmp = Math.floor((tmp-diff.min)/60);
		diff.hours = tmp % 24;
		
		tmp = Math.floor((tmp-diff.hours)/24);
		diff.days = tmp;

		// console.log(diff)
		
		return diff;
	}

    async getGlobalStats() {
        const users = await this.prisma.user.findMany();
        const games = await this.prisma.games.findMany();
        const globalStats: GlobalStats = {
            nbGames: games.length,
            nbUsers: users.length,
            averageElo: Math.trunc(
                users.reduce((acc, curr) => acc + curr.elo, 0) / users.length,
            ),
        };
        // console.log('global stats');
        // console.log(globalStats);
        return globalStats;
    }

    async createMe() {
        const date = new Date();
        const newGame1 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    2022,
                    8,
                    5,
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    2022,
                    8,
                    5,
                    date.getHours(),
                    date.getMinutes() + 2,
                    date.getSeconds() + 5,
                ),
                won: true,
                scoreA: 5,
                scoreB: 4,
                mode: 0,
                UserA: { connect: { id: 1 } },
                UserB: { connect: { id: 2 } },
            },
        });
        const newGame2 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    2023,
                    8,
                    21,
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    2023,
                    8,
                    21,
                    date.getHours(),
                    date.getMinutes() + 5,
                    date.getSeconds() + 26,
                ),
                won: false,
                scoreA: 3,
                scoreB: 5,
                mode: 1,
                UserA: { connect: { id: 1 } },
                UserB: { connect: { id: 2 } },
            },
        });
        const newGame3 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    2023,
                    8,
                    15,
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    2023,
                    8,
                    15,
                    date.getHours(),
                    date.getMinutes() + 3,
                    date.getSeconds() + 5,
                ),
                won: true,
                scoreA: 6,
                scoreB: 2,
                mode: 0,
                UserA: { connect: { id: 2 } },
                UserB: { connect: { id: 1 } },
            },
        });
        const newGame4 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes() + 6,
                    date.getSeconds() + 46,
                ),
                won: true,
                scoreA: 5,
                scoreB: 4,
                mode: 0,
                UserA: { connect: { id: 1 } },
                UserB: { connect: { id: 2 } },
            },
        });
        const newGame5 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes() + 2,
                    date.getSeconds() + 5,
                ),
                won: false,
                scoreA: 3,
                scoreB: 5,
                mode: 0,
                UserA: { connect: { id: 1 } },
                UserB: { connect: { id: 2 } },
            },
        });
        const newGame6 = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                ),
                finishedAt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes() + 0,
                    date.getSeconds() + 51,
                ),
                won: true,
                scoreA: 6,
                scoreB: 2,
                mode: 0,
                UserA: { connect: { id: 2 } },
                UserB: { connect: { id: 1 } },
            },
        });

        return;
    }
}
