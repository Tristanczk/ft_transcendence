import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from 'src/games/games.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    DiffDate,
    GlobalStats,
    UserLeaderboard,
    UserStats,
} from './stats.type';
import { GameExtractedDB } from 'src/games/games.types';
import { Games, User } from '@prisma/client';
import { LeaderbordResponseDto } from './dto/leaderbord-response.dto';

export type ArrayGraphType = {
    id: string | number;
    data: ArrayDataGraph[];
};

export type ArrayDataGraph = {
    x: number | string | Date;
    y: number | string | Date;
};

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
                    (acc, curr) => acc + (curr.won ? 0 : 1),
                    0,
                ),
            averageDuration: Math.trunc(
                gameList.reduce(
                    (acc, curr) =>
                        acc +
                        this.gameService.computeDuration(
                            curr.createdAt,
                            curr.finishedAt,
                        ),
                    0,
                ) / gameList.length,
            ),
			elo: user.elo,
            highElo: user.highElo,
			averageEloOpponents: gameList.length !== 0 ? (Math.trunc(
                gameList.reduce(
                    (acc, curr) =>
                        acc + (curr.playerA === idUser ? curr.initEloB : curr.initEloA), 
                    0,
                ) / gameList.length,
            )) : 0,
            daysSinceRegister: this.dateDiff(user.createdAt, new Date()).days,
        };
        return userStats;
    }

    dateDiff(date1, date2): DiffDate {
        var diff: DiffDate = { sec: 0, min: 0, hours: 0, days: 0 };
        var tmp = date2 - date1;
        tmp = Math.floor(tmp / 1000);
        diff.sec = tmp % 60;
        tmp = Math.floor((tmp - diff.sec) / 60);
        diff.min = tmp % 60;
        tmp = Math.floor((tmp - diff.min) / 60);
        diff.hours = tmp % 24;
        tmp = Math.floor((tmp - diff.hours) / 24);
        diff.days = tmp;
        return diff;
    }

    //pour toi petit curieux: je n'aurai pas fait cette fonction comme ca dans la vraie vie !
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
        return globalStats;
    }

    async getGamesPlayer(
        idUser: number,
        nbGames: number,
        sortAsc: boolean,
    ): Promise<Games[]> {
        const data = await this.prisma.user.findUnique({
            where: {
                id: idUser,
            },
            include: {
                gamesasPlayerA: true,
                gamesasPlayerB: true,
            },
        });
        if (!data) throw new NotFoundException('No user found');

        const gameList: Games[] = data.gamesasPlayerA.concat(
            data.gamesasPlayerB,
        );

        if (sortAsc === true) gameList.sort((a, b) => a.id - b.id);
        else gameList.sort((a, b) => b.id - a.id);

        let newGameList: Games[] = [];
        if (gameList.length <= nbGames) newGameList = gameList;
        else newGameList = gameList.slice(-nbGames);

        return newGameList;
    }

    async getDataGraph(idUser: number) {
        let dataGraph: ArrayGraphType[] = [];

        const dataSerieNormal: ArrayDataGraph[] =
            await this.getDataGraphMode(idUser);
        const newElemGraph: ArrayGraphType = {
            id: 'Normal mode',
            data: dataSerieNormal,
        };
        if (dataSerieNormal.length !== 0) dataGraph.push(newElemGraph);

        return dataGraph;
    }

    async getDataGraphMode(idUser: number): Promise<ArrayDataGraph[]> {
        let dataSerie: ArrayDataGraph[] = [];

        const data: GameExtractedDB[] = await this.getGamesPlayer(
            idUser,
            30,
            true,
        );
        let i: number = data.length;
		if (data.length === 0) return dataSerie;
		if (data.length < 30) {
			const newDataElem: ArrayDataGraph = {
                x: 'Init',
                y: 1000,
            };
            dataSerie.push(newDataElem);
		}
        data.forEach((game: GameExtractedDB) => {
            const newDataElem: ArrayDataGraph = {
                x: i,
                y: idUser === game.playerA ? (game.initEloA + game.varEloA) : (game.initEloB + game.varEloB),
            };
            dataSerie.push(newDataElem);
            i--;
        });
        return dataSerie;
    }

    async getLeaderboard(): Promise<UserLeaderboard[]> {
        try {
            const leaders = await this.prisma.user.findMany({
                orderBy: {
                    elo: 'desc',
                },
                take: 10,
                include: {
                    gamesasPlayerA: true,
                    gamesasPlayerB: true,
                },
            });
            let leaderboard: UserLeaderboard[] = [];
			let lastElo: number = 0;
			let rank: number = 0;
			let tmpRank: number = 0;
            leaders.forEach((user) => {
				if (lastElo === user.elo) {
					tmpRank++;
				}
				else {
					rank = rank + 1 + tmpRank;
					tmpRank = 0;
				}

                const newElem: UserLeaderboard = {
                    id: user.id,
					rank: rank,
                    avatarPath: user.avatarPath,
                    createdAt: user.createdAt,
                    elo: user.elo,
                    isConnected: user.isConnected,
                    nickname: user.nickname,
                    nbGames:
                        user.gamesasPlayerA.length + user.gamesasPlayerB.length,
                };
                leaderboard.push(newElem);
				lastElo = newElem.elo;
            });

            return leaderboard;
        } catch (error) {
            throw error;
        }
    }
}
