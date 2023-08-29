import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateGameDto } from './dto/update-game.dto';
import { GameExports, UserGame } from './games.types';
import { DiffDate } from 'src/stats/stats.type';

export type CurrentGame = {
    idGame: number;
    idPlayerA: number;
    eloPlayerA: number;
    idPlayerB: number;
    eloPlayerB: number;
};

@Injectable()
export class GamesService {
    constructor(private prisma: PrismaService) {}

    dataGamesPlaying: CurrentGame[] = [];

    async initGame(idUser: number, idPlayerB: number, mode: number) {
        console.log('initGame ' + idUser + ' against ' + idPlayerB);
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
                    mode: mode,
                    UserA: { connect: { id: idUser } },
                    UserB: { connect: { id: idPlayerB } },
                },
            });
            const thisGame: CurrentGame = {
                idGame: newGame.id,
                idPlayerA: idUser,
                eloPlayerA: 0,
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
        console.log('updateGame ' + idGame + ' result ' + body);
        const retour = await this.prisma.games.update({
            where: { id: idGame },
            data: {
                finished: true,
                finishedAt: new Date(),
                scoreA: body.scoreA,
                scoreB: body.scoreB,
				varEloA: 0,
                varEloB: 0,
                won: body.won,
            },
        });
        return retour;
    }

	async computeElo(idGame: number) {

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
        // console.log(userId + ' : A=' + data.gamesasPlayerA.length + ', B=' + data.gamesasPlayerB.length + ', tot=' + gameList.length)

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
            );
            newElem.playerB = this.getUserFormat(
                elem.playerB,
                users,
                elem.scoreB,
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

    //to do : amend for month just in case
    computeDuration1(start: Date, end: Date): number {
        const seconds = Math.abs(end.getSeconds() - start.getSeconds());
        const minutes = Math.abs(end.getMinutes() - start.getMinutes());
        const hours = Math.abs(end.getHours() - start.getHours());
        const days = Math.abs(end.getDate() - start.getDate());
        const duration: number =
            days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

        // console.log('duration=' + duration)
        return duration;
    }

    // dateDiffInDays(a, b) {
    // 	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // 	// Discard the time and time-zone information.
    // 	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    // 	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    // 	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    //   }

    getUserFormat(userId: number, users: any, score: number): UserGame {
        let formatedUser: UserGame = { id: -1, nickname: '', elo: 0, score: 0 };
        const user = users.find((user) => user.id === userId);

        formatedUser.id = userId;
        formatedUser.nickname = user.nickname;
        formatedUser.elo = user.elo;
        formatedUser.score = score;
        return formatedUser;
    }
}
