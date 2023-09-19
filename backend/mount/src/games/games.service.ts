import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateGameDto } from './dto/update-game.dto';
import {
    AchievType,
    GameExports,
    UserGame,
    dataAchievements,
} from './games.types';
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

    async initGame(idPlayerA: number, idPlayerB: number, mode: number) {
        //verif players
        let verifiedIdPlayerA: number = -1;
        let playerA: User | null = null;
        let verifiedIdPlayerB: number = -1;
        let playerB: User | null = null;

        try {
            playerA = await this.prisma.user.findUnique({
                where: { id: idPlayerA },
            });
            verifiedIdPlayerA = idPlayerA;
        } catch (error) {
            console.log('A not found');
            verifiedIdPlayerA = -1;
        }

        try {
            playerB = await this.prisma.user.findUnique({
                where: { id: idPlayerB },
            });
            verifiedIdPlayerB = idPlayerB;
        } catch (error) {
            console.log('B not found');
            verifiedIdPlayerB = -1;
        }

        //verif playerB exist
        // const playerB: User = await this.prisma.user.findUnique({
        //     where: { id: idPlayerB },
        // });

        // if (!playerB) throw new NotFoundException();

        //creating game
        try {
            let newGame: Games = null;
            if (playerA && playerB) {
                newGame = await this.prisma.games.create({
                    data: {
                        finished: false,
                        finishedAt: new Date(),
                        won: true,
                        aborted: false,
                        scoreA: 0,
                        scoreB: 0,
                        varEloA: 0,
                        varEloB: 0,
                        initEloA: playerA ? playerA.elo : 1000,
                        initEloB: playerB ? playerB.elo : 1000,
                        mode: mode,
                        UserA: { connect: { id: playerA.id } },
                        UserB: { connect: { id: playerB.id } },
                    },
                });
            } else if (playerA) {
                newGame = await this.prisma.games.create({
                    data: {
                        finished: false,
                        finishedAt: new Date(),
                        won: true,
                        aborted: false,
                        scoreA: 0,
                        scoreB: 0,
                        varEloA: 0,
                        varEloB: 0,
                        initEloA: playerA ? playerA.elo : 1000,
                        initEloB: playerB ? playerB.elo : 1000,
                        mode: mode,
                        UserA: { connect: { id: playerA.id } },
                    },
                });
            } else if (playerB) {
                newGame = await this.prisma.games.create({
                    data: {
                        finished: false,
                        finishedAt: new Date(),
                        won: true,
                        aborted: false,
                        scoreA: 0,
                        scoreB: 0,
                        varEloA: 0,
                        varEloB: 0,
                        initEloA: playerA ? playerA.elo : 1000,
                        initEloB: playerB ? playerB.elo : 1000,
                        mode: mode,
                        UserB: { connect: { id: playerB.id } },
                    },
                });
            } else {
                newGame = await this.prisma.games.create({
                    data: {
                        finished: false,
                        finishedAt: new Date(),
                        won: true,
                        aborted: false,
                        scoreA: 0,
                        scoreB: 0,
                        varEloA: 0,
                        varEloB: 0,
                        initEloA: playerA ? playerA.elo : 1000,
                        initEloB: playerB ? playerB.elo : 1000,
                        mode: mode,
                    },
                });
            }

            const thisGame: CurrentGame = {
                idGame: newGame.id,
                idPlayerA: playerA ? playerA.id : -1,
                eloPlayerA: playerA ? playerA.elo : 1000,
                idPlayerB: playerB ? playerB.id : -1,
                eloPlayerB: playerB ? playerB.elo : 1000,
            };
            this.dataGamesPlaying.push(thisGame);
            return newGame.id;
        } catch (error) {
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
                aborted: body.aborted,
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
        const probaB = 1 - probaA;

        const varEloA = Math.round(32 * ((won ? 1 : 0) - probaA));
        const varEloB = Math.round(32 * ((won ? 0 : 1) - probaB));

        const variation: VariationElo = { varEloA: varEloA, varEloB: varEloB };

        if (this.dataGamesPlaying[gameIndex].idPlayerA !== -1) {
            await this.prisma.user.update({
                where: { id: this.dataGamesPlaying[gameIndex].idPlayerA },
                data: {
                    elo: won ? { increment: varEloA } : { decrement: -varEloA },
                },
            });
        }

        if (this.dataGamesPlaying[gameIndex].idPlayerB !== -1) {
            await this.prisma.user.update({
                where: { id: this.dataGamesPlaying[gameIndex].idPlayerB },
                data: {
                    elo: won ? { decrement: -varEloB } : { increment: varEloB },
                },
            });
        }

        this.dataGamesPlaying.splice(gameIndex, 1);

        return variation;
    }

    async historyFiveGames(userId: number) {
        try {
            const gamesTab: Games[] = await this.getGamesPlayer(
                userId,
                5,
                true,
            );
            gamesTab.sort((a, b) => b.id - a.id);
            const transformedTab = await this.transformListReadable(gamesTab);
            return transformedTab;
        } catch (error) {
            throw error;
        }
    }

    async historyAllGames(userId: number) {
        try {
            const gamesTab: Games[] = await this.getGamesPlayer(
                userId,
                -1,
                false,
            );
            const transformedTab = this.transformListReadable(gamesTab);
            return transformedTab;
        } catch (error) {
            return null;
        }
    }

    async transformListReadable(tab: Games[]) {
        const tabId: number[] = [];
        tab.forEach((element) => {
            if (element.playerA && !tabId.includes(element.playerA)) {
                tabId.push(element.playerA);
            }
            if (element.playerB && !tabId.includes(element.playerB)) {
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
                finished: true,
                mode: 0,
                won: true,
                aborted: false,
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
            newElem.aborted = elem.aborted;
            newElem.finished = elem.finished;
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
        let user = null;
        if (userId) user = users.find((user) => user.id === userId);

        formatedUser.id = userId ? userId : -1;
        formatedUser.nickname = user ? user.nickname : 'anonymous';
        formatedUser.elo = user ? user.elo : 1000;
        formatedUser.eloStart = initElo;
        formatedUser.score = score;
        return formatedUser;
    }

    async checkAchievements(game: Games) {
        let achievement: string;
        let achievNb: number;
        let achievBool: boolean;
        let achievementsA: string[] = [];
        let achievementsB: string[] = [];
        let playerA: User = null;
        let playerB: User = null;
        let gamesPlayerA: Games[] = [];
        let gamesPlayerB: Games[] = [];

        try {
            if (game.playerA) {
                playerA = await this.prisma.user.findUnique({
                    where: { id: game.playerA },
                });
            }

            if (game.playerB) {
                playerB = await this.prisma.user.findUnique({
                    where: { id: game.playerB },
                });
            }

            if (playerA)
                gamesPlayerA = await this.getGamesPlayer(playerA.id, -1, true);
            if (playerB)
                gamesPlayerB = await this.getGamesPlayer(playerB.id, -1, true);
        } catch (error) {
            throw new ForbiddenException('User does not exists');
            return;
        }

        //achievement ELO
        if (playerA) {
            achievement = this.achievementElo(playerA);
            achievement && achievementsA.push(achievement);
        }

        if (playerB) {
            achievement = this.achievementElo(playerB);
            achievement && achievementsB.push(achievement);
        }

        //achievement score
        achievNb = this.achievementScoreTakeAll(game);
        if (playerA) {
            achievNb === 1 && achievementsA.push('classic-boss');
        }
        if (playerB) {
            achievNb === 2 && achievementsB.push('classic-boss');
        }

        //achievement time < 60sec
        achievNb = this.achievementClassicTime(game);
        if (playerA) {
            achievNb === 1 && achievementsA.push('classic-win-time');
        }

        if (playerB) {
            achievNb === 2 && achievementsB.push('classic-win-time');
        }

        //achievement Marathon
        achievement = this.achievementMarathon(game);
        if (playerA) {
            achievement && achievementsA.push(achievement);
        }

        if (playerB) {
            achievement && achievementsB.push(achievement);
        }

        //achievement based on games history
        //played 1 game in classic mode
        if (playerA) {
            achievBool = this.achievementNbGames(
                gamesPlayerA,
                0,
                playerA.id,
                1,
                false,
            );
            achievBool && achievementsA.push('classic-1');
        }

        if (playerB) {
            achievBool = this.achievementNbGames(
                gamesPlayerB,
                0,
                playerB.id,
                1,
                false,
            );
            achievBool && achievementsB.push('classic-1');
        }

        //played 5 game in classic mode
        if (playerA) {
            achievBool = this.achievementNbGames(
                gamesPlayerA,
                0,
                playerA.id,
                5,
                false,
            );
            achievBool && achievementsA.push('classic-5');
        }

        if (playerB) {
            achievBool = this.achievementNbGames(
                gamesPlayerB,
                0,
                playerB.id,
                5,
                false,
            );
            achievBool && achievementsB.push('classic-5');
        }

        //won 1 game in classic mode
        if (playerA) {
            achievBool = this.achievementNbGames(
                gamesPlayerA,
                0,
                playerA.id,
                1,
                true,
            );
            achievBool && achievementsA.push('classic-win-1');
        }

        if (playerB) {
            achievBool = this.achievementNbGames(
                gamesPlayerB,
                0,
                playerB.id,
                1,
                true,
            );
            achievBool && achievementsB.push('classic-win-1');
        }

        //won 5 game in classic mode
        if (playerA) {
            achievBool = this.achievementNbGames(
                gamesPlayerA,
                0,
                playerA.id,
                5,
                true,
            );
            achievBool && achievementsA.push('classic-win-5');
        }

        if (playerB) {
            achievBool = this.achievementNbGames(
                gamesPlayerB,
                0,
                playerB.id,
                5,
                true,
            );
            achievBool && achievementsB.push('classic-win-5');
        }

        try {
            if (playerA) {
                await this.saveAchievements(
                    achievementsA,
                    playerA.achievements,
                    playerA.id,
                );
            }

            if (playerB) {
                await this.saveAchievements(
                    achievementsB,
                    playerB.achievements,
                    playerB.id,
                );
            }
        } catch (error) {
            return;
        }
        return true;
    }

    async saveAchievements(
        achievementsWon: string[],
        currAchiev: string[],
        idPlayer: number,
    ) {
        const achievToSave: string[] = achievementsWon.filter((elem) => {
            if (currAchiev.includes(elem) === false) return true;
        });
        currAchiev = currAchiev.concat(achievToSave);
        try {
            await this.prisma.user.update({
                where: { id: idPlayer },
                data: { achievements: currAchiev },
            });
        } catch (error) {
            throw error;
        }
    }

    achievementElo(player: User): string {
        if (player.elo >= 1200) return 'classic-1200';
        else if (player.elo >= 1100) return 'classic-1100';
        return null;
    }

    achievementMarathon(game: Games): string {
        if (game.scoreA + game.scoreB >= 30) return 'classic-marathon';
        return null;
    }

    achievementScoreTakeAll(game: Games): number {
        if (game.scoreA === 7 && game.scoreB === 0) return 1;
        else if (game.scoreA === 0 && game.scoreB === 7) return 2;
        return 0;
    }

    achievementClassicTime(game: Games): number {
        const totalTime: number = this.computeDuration(
            game.createdAt,
            game.finishedAt,
        );
        if (totalTime > 60) return 0;
        if (game.won) return 1;
        else if (!game.won) return 2;
        return 0;
    }

    //mode=-1: stats pour tous les modes
    achievementNbGames(
        games: Games[],
        mode: number,
        idPlayer: number,
        nbToValidate: number,
        isWon: boolean,
    ): boolean {
        let nb: number = 0;
        games.forEach((elem) => {
            if (isWon === true) {
                if (
                    elem.mode === mode &&
                    elem.won === true &&
                    elem.playerA === idPlayer
                )
                    nb++;
                else if (
                    elem.mode === mode &&
                    elem.won === false &&
                    elem.playerB === idPlayer
                )
                    nb++;
            } else {
                if (elem.mode === mode) nb++;
                else if (mode === -1) nb++;
            }
        });
        if (nb >= nbToValidate) return true;
        return false;
    }

    //nbGames=-1 => all games
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
        if (nbGames === -1) newGameList = gameList;
        else if (gameList.length <= nbGames) newGameList = gameList;
        else newGameList = gameList.slice(-nbGames);

        return newGameList;
    }

    async getAchievementsUser(idUser: number): Promise<AchievType[]> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: idUser },
            });
            if (!user) return [];

            const achiev: AchievType[] = dataAchievements;
            for (let i = 0; i < achiev.length; i++) {
                const foundIndex = user.achievements.findIndex(
                    (e) => e === achiev[i].id,
                );
                if (foundIndex !== -1) {
                    achiev[i].userHave = true;
                } else achiev[i].userHave = false;
            }
            return achiev;
        } catch (error) {
            throw error;
        }
    }
}
