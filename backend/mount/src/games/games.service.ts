import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateGameDto } from './dto/update-game.dto';
import { GameExports, UserGame } from './games.types';
import { DiffDate } from 'src/stats/stats.type';
import { Games, User } from '@prisma/client';

export type CurrentGame = {
    idGame: number;
    idPlayerA: number;
    eloPlayerA: number;
    idPlayerB: number;
    eloPlayerB: number;
};

export type VariationElo = {
    varEloA: number;
    varEloB: number;
};

@Injectable()
export class GamesService {
    constructor(private prisma: PrismaService) {}

    dataGamesPlaying: CurrentGame[] = [];

    async initGame(playerA: any, idPlayerB: number, mode: number) {
        //verif playerB exist
        const playerB = await this.prisma.user.findUnique({
            where: { id: idPlayerB },
        });
        if (!playerB) throw new NotFoundException();

        //creating game
        try {
            const newGame = await this.prisma.games.create({
                data: {
                    finished: false,
                    finishedAt: new Date(),
                    won: true,
                    scoreA: 0,
                    scoreB: 0,
                    varEloA: 0,
                    varEloB: 0,
                    initEloA: playerA.elo,
                    initEloB: playerB.elo,
                    mode: mode,
                    UserA: { connect: { id: playerA.id } },
                    UserB: { connect: { id: idPlayerB } },
                },
            });
            const thisGame: CurrentGame = {
                idGame: newGame.id,
                idPlayerA: playerA.id,
                eloPlayerA: playerA.elo,
                idPlayerB: idPlayerB,
                eloPlayerB: playerB.elo,
            };
            this.dataGamesPlaying.push(thisGame);
            return newGame.id;
        } catch (error) {
            console.log(error);
            throw new ConflictException('Could not create game');
        }
    }

    async updateGame(idGame: number, body: updateGameDto) {
        // console.log('updateGame ' + idGame + ' result ' + body);
        const varElo: VariationElo = await this.computeElo(idGame, body.won);
        const retour = await this.prisma.games.update({
            where: { id: idGame },
            data: {
                finished: true,
                finishedAt: new Date(),
                scoreA: body.scoreA,
                scoreB: body.scoreB,
                varEloA: varElo.varEloA,
                varEloB: varElo.varEloB,
                won: body.won,
            },
        });
        this.checkAchievements(retour);
        return retour;
    }

    async computeElo(idGame: number, won: boolean) {
        const gameIndex = this.dataGamesPlaying.findIndex(
            (e) => e.idGame === idGame,
        );
        if (gameIndex === -1)
            throw new NotFoundException('idGame not currently playing?');
        const probaA =
            1 /
            (1 +
                Math.pow(
                    10,
                    (this.dataGamesPlaying[gameIndex].eloPlayerB -
                        this.dataGamesPlaying[gameIndex].eloPlayerA) /
                        400,
                ));

        const varEloA = Math.round(32 * ((won ? 1 : 0) - probaA));
        const varEloB = Math.round(32 * ((won ? 0 : 1) - probaA));

        const variation: VariationElo = { varEloA: varEloA, varEloB: varEloB };

        await this.prisma.user.update({
            where: { id: this.dataGamesPlaying[gameIndex].idPlayerA },
            data: {
                elo: won ? { increment: varEloA } : { decrement: -varEloA },
            },
        });

        await this.prisma.user.update({
            where: { id: this.dataGamesPlaying[gameIndex].idPlayerB },
            data: {
                elo: won ? { decrement: -varEloB } : { increment: varEloB },
            },
        });

        this.dataGamesPlaying.splice(gameIndex, 1);

        return variation;
    }

    async historyFiveGames(userId: number) {
        const data = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                gamesasPlayerA: true,
                gamesasPlayerB: true,
            },
        });
        if (!data) throw new NotFoundException('No user found');

        const gameList = data.gamesasPlayerA.concat(data.gamesasPlayerB);
        gameList.sort((a, b) => a.id - b.id);

        let newGameList = [];
        if (gameList.length <= 5) newGameList = gameList;
        else newGameList = gameList.slice(-5);

        const transformedTab = this.transformListReadable(newGameList);

        return transformedTab;
    }

    async transformListReadable(tab: any) {
        const tabId: number[] = [];
        tab.forEach((element) => {
            if (!tabId.includes(element.playerA)) {
                tabId.push(element.playerA);
            }
            if (!tabId.includes(element.playerB)) {
                tabId.push(element.playerB);
            }
        });

        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    in: tabId,
                },
            },
        });

        let transformedTab: GameExports[] = [];
        tab.forEach((elem) => {
            let newElem: GameExports = {
                gameId: -1,
                date: new Date(),
                duration: 0,
                mode: 0,
                won: true,
                playerA: null,
                playerB: null,
            };
            newElem.gameId = elem.id;
            newElem.date = elem.createdAt;
            newElem.duration = this.computeDuration(
                elem.createdAt,
                elem.finishedAt,
            );
            newElem.mode = elem.mode;
            newElem.won = elem.won;
            newElem.playerA = this.getUserFormat(
                elem.playerA,
                users,
                elem.scoreA,
                elem.initEloA,
            );
            newElem.playerB = this.getUserFormat(
                elem.playerB,
                users,
                elem.scoreB,
                elem.initEloB,
            );
            transformedTab.push(newElem);
        });
        return transformedTab;
    }

    computeDuration(date1, date2): number {
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

        return (
            diff.sec +
            diff.min * 60 +
            diff.hours * 60 * 60 +
            diff.days * 24 * 60 * 60
        );
    }

    getUserFormat(
        userId: number,
        users: any,
        score: number,
        initElo: number,
    ): UserGame {
        let formatedUser: UserGame = {
            id: -1,
            nickname: '',
            elo: 0,
            eloStart: 0,
            score: 0,
        };
        const user = users.find((user) => user.id === userId);

        formatedUser.id = userId;
        formatedUser.nickname = user.nickname;
        formatedUser.elo = user.elo;
        formatedUser.eloStart = initElo;
        formatedUser.score = score;
        return formatedUser;
    }

	async checkAchievements(game: Games) {
		let achievement: String;
		let achievNb: number;
		let achievementsA: String[] = []
		let achievementsB: String[] = []
        let playerA: User = null;
		let playerB: User = null;
        
		try {
            playerA = await this.prisma.user.findUnique({
                where: { id: game.playerA },
            });
            playerB = await this.prisma.user.findUnique({
                where: { id: game.playerB },
            });
            
        } catch (error) {
            console.log(error);
			return ;
        }

		console.log(game);
		console.log(playerA);
		console.log(playerB);

		//achievement ELO
		achievement = this.achievementElo(playerA)
		achievement && achievementsA.push(achievement)
		achievement = this.achievementElo(playerB)
		achievement && achievementsB.push(achievement)

		//achievement score
		achievNb = this.achievementScoreTakeAll(game)
		achievNb === 1 && achievementsA.push('classic-boss')
		achievNb === 2 && achievementsB.push('classic-boss')

		//achievement time < 60sec
		achievNb = this.achievementClassicTime(game)
		achievNb === 1 && achievementsA.push('classic-win-time')
		achievNb === 2 && achievementsB.push('classic-win-time')

		//achievement Marathon
		achievement = this.achievementMarathon(game)
		achievement && achievementsA.push(achievement)
		achievement && achievementsB.push(achievement)

		console.log('achievements:')
		console.log(achievementsA)
		console.log(achievementsB)
    }

	achievementElo(player: User): String {
		if (player.elo >= 1100)
			return 'classic-1100'
		else if (player.elo >= 1200)
			return 'classic-1200'
		return null;
	}

	achievementMarathon(game: Games): String {
		if ((game.scoreA + game.scoreB) >= 30)
			return 'classic-marathon'
		return null;
	}

	achievementScoreTakeAll(game: Games): number {
		if (game.scoreA === 7 && game.scoreB === 0)
			return 1
		else if (game.scoreA === 0 && game.scoreB === 7)
			return 2
		return 0;
	}

	achievementClassicTime(game: Games): number {
		const totalTime: number = this.computeDuration(game.createdAt, game.finishedAt)
		if (totalTime > 60)
			return 0;
		if (game.won)
			return 1
		else if (!game.won)
			return 2
		return 0;
	}

}
