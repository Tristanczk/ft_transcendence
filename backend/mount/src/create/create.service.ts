import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { FriendsService } from 'src/friends/friends.service';

export type UsersCreate = {
    id: number;
    nickname: string;
    email: string;
    avatarPath: string;
    elo: number;
};

export type VariationElo = {
    varEloA: number;
    varEloB: number;
};

@Injectable()
export class CreateService {
    constructor(
        private prisma: PrismaService,
        private friends: FriendsService,
    ) {}

    arrayUsers: UsersCreate[] = [];

    arrayGames: number[] = [];

    async clean() {
        for (const id of this.arrayGames) {
            await this.prisma.games.delete({ where: { id: id } });
        }

        for (const elem of this.arrayUsers) {
            await this.prisma.user.delete({ where: { id: elem.id } });
        }
        this.arrayUsers = [];
        this.arrayGames = [];
    }

    async createUsers() {
        let date: Date = null;
        let user: UsersCreate = null;

        date = new Date(2023, 8 - 1, 25, 15, 30, 50);
        user = await this.createUser(
            'user1',
            'test1@mail.com',
            'Password1',
            'default.png',
            date,
        );
        this.arrayUsers.push(user);

        date = new Date(2023, 8 - 1, 26, 19, 25, 0);
        user = await this.createUser(
            'user2',
            'test2@mail.com',
            'Password1',
            'omer.png',
            date,
        );
        this.arrayUsers.push(user);

        date = new Date(2023, 8 - 1, 27, 5, 32, 6);
        user = await this.createUser(
            'user3',
            'test3@mail.com',
            'Password1',
            'bart.png',
            date,
        );
        this.arrayUsers.push(user);

        // date = new Date(2023, 7 - 1, 15, 5, 32, 6)
        // user = await this.createUser('user4', 'test4@mail.com', 'Password1', 'default.png', date);
        // this.arrayUsers.push(user);

        // date = new Date(2023, 7 - 1, 21, 5, 32, 6)
        // user = await this.createUser('user5', 'test5@mail.com', 'Password1', 'omer.png', date);
        // this.arrayUsers.push(user);

        // date = new Date(2023, 7 - 1, 28, 5, 32, 6)
        // user = await this.createUser('user6', 'test6@mail.com', 'Password1', 'bart.png', date);
        // this.arrayUsers.push(user);
    }

    async createUser(
        nickname: string,
        email: string,
        password: string,
        avatarPath: string,
        created: Date,
    ): Promise<UsersCreate> {
        const hash = await argon.hash(password);
        const user = await this.prisma.user.create({
            data: {
                login: nickname,
                createdAt: created,
                nickname: nickname,
                email: email,
                avatarPath: avatarPath,
                elo: 1000,
                loginNb: 1,
                hash,
            },
        });
        return user;
    }

    async createGames() {
        let dateStart: Date = null;
        let dateEnd: Date = null;
        let idGame: number = 0;

        dateStart = new Date(2023, 8 - 1, 25, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[0].id,
            this.arrayUsers[1].id,
            dateStart,
            dateEnd,
            8,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 26, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 3,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[2].id,
            this.arrayUsers[1].id,
            dateStart,
            dateEnd,
            6,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 25, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 4,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[1].id,
            this.arrayUsers[0].id,
            dateStart,
            dateEnd,
            4,
            6,
            false,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 25, 16, 20, 0);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 2,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[2].id,
            this.arrayUsers[0].id,
            dateStart,
            dateEnd,
            9,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 26, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes(),
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[2].id,
            this.arrayUsers[1].id,
            dateStart,
            dateEnd,
            6,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 25, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[1].id,
            this.arrayUsers[0].id,
            dateStart,
            dateEnd,
            4,
            6,
            false,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 25, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[0].id,
            this.arrayUsers[2].id,
            dateStart,
            dateEnd,
            2,
            5,
            false,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 26, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 3,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[2].id,
            this.arrayUsers[1].id,
            dateStart,
            dateEnd,
            6,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 25, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 4,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            this.arrayUsers[1].id,
            this.arrayUsers[0].id,
            dateStart,
            dateEnd,
            4,
            6,
            false,
            0,
        );
        this.arrayGames.push(idGame);
    }

    async createGame(
        playerA: number,
        playerB: number,
        created: Date,
        finished: Date,
        scoreA: number,
        scoreB: number,
        won: boolean,
        mode: number,
    ) {
        const userAIndex: number = this.arrayUsers.findIndex(
            (elem) => elem.id === playerA,
        );
        const userBIndex: number = this.arrayUsers.findIndex(
            (elem) => elem.id === playerB,
        );
        const variation: VariationElo = await this.computeElo(
            userAIndex,
            userBIndex,
            won,
        );
        const newGame = await this.prisma.games.create({
            data: {
                finished: true,
                createdAt: created,
                finishedAt: finished,
                won: won,
                scoreA: scoreA,
                scoreB: scoreB,
                varEloA: variation.varEloA,
                varEloB: variation.varEloB,
                initEloA: this.arrayUsers[userAIndex].elo,
                initEloB: this.arrayUsers[userBIndex].elo,
                mode: mode,
                UserA: { connect: { id: playerA } },
                UserB: { connect: { id: playerB } },
            },
        });
        return newGame.id;
    }

    async createFriendships() {
        await this.friends.addNewFriend(
            this.arrayUsers[1].id,
            this.arrayUsers[2].id,
        );
        await this.friends.addNewFriend(
            this.arrayUsers[0].id,
            this.arrayUsers[1].id,
        );
    }

    async createGamesForExisting() {
        let dateStart: Date = null;
        let dateEnd: Date = null;
        let idGame: number = 0;

        const userAIndex = 1;
        const userBIndex = 3;
        const userCIndex = 2;
        const userA = await this.prisma.user.findUnique({
            where: { id: userAIndex },
        });
        const userB = await this.prisma.user.findUnique({
            where: { id: userBIndex },
        });
        const userC = await this.prisma.user.findUnique({
            where: { id: userCIndex },
        });

        this.arrayUsers.push(userA);
        this.arrayUsers.push(userB);
        this.arrayUsers.push(userC);

        //between A and B
        dateStart = new Date(2023, 8 - 1, 30, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userAIndex,
            userBIndex,
            dateStart,
            dateEnd,
            8,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 30, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 3,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userAIndex,
            userBIndex,
            dateStart,
            dateEnd,
            6,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 31, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 4,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userBIndex,
            userAIndex,
            dateStart,
            dateEnd,
            4,
            6,
            false,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 31, 16, 20, 0);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 2,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userBIndex,
            userAIndex,
            dateStart,
            dateEnd,
            9,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 31, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes(),
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userAIndex,
            userBIndex,
            dateStart,
            dateEnd,
            6,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        //between A and C
        dateStart = new Date(2023, 8 - 1, 30, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userAIndex,
            userCIndex,
            dateStart,
            dateEnd,
            8,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);

        dateStart = new Date(2023, 8 - 1, 30, 16, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 3,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userAIndex,
            userCIndex,
            dateStart,
            dateEnd,
            4,
            5,
            false,
            0,
        );
        this.arrayGames.push(idGame);

        //between B and C
        dateStart = new Date(2023, 8 - 1, 30, 15, 30, 50);
        dateEnd = new Date(
            2023,
            dateStart.getMonth(),
            dateStart.getDate(),
            dateStart.getHours(),
            dateStart.getMinutes() + 1,
            dateStart.getSeconds() + 22,
        );
        idGame = await this.createGame(
            userCIndex,
            userBIndex,
            dateStart,
            dateEnd,
            8,
            5,
            true,
            0,
        );
        this.arrayGames.push(idGame);
    }

    async computeElo(
        userAIndex: number,
        userBIndex: number,
        won: boolean,
    ): Promise<VariationElo> {
        const probaA =
            1 /
            (1 +
                Math.pow(
                    10,
                    (this.arrayUsers[userBIndex].elo -
                        this.arrayUsers[userAIndex].elo) /
                        400,
                ));

        const varEloA = Math.round(32 * ((won ? 1 : 0) - probaA));
        const varEloB = Math.round(32 * ((won ? 0 : 1) - probaA));

        const variation: VariationElo = { varEloA: varEloA, varEloB: varEloB };

        if (won) {
            this.arrayUsers[userAIndex].elo =
                this.arrayUsers[userAIndex].elo + varEloA;
            this.arrayUsers[userBIndex].elo =
                this.arrayUsers[userBIndex].elo + varEloB;
        } else {
            this.arrayUsers[userAIndex].elo =
                this.arrayUsers[userAIndex].elo + varEloA;
            this.arrayUsers[userBIndex].elo =
                this.arrayUsers[userBIndex].elo + varEloB;
        }

        await this.prisma.user.update({
            where: { id: this.arrayUsers[userAIndex].id },
            data: {
                elo: won ? { increment: varEloA } : { decrement: -varEloA },
            },
        });
        await this.prisma.user.update({
            where: { id: this.arrayUsers[userBIndex].id },
            data: {
                elo: won ? { decrement: -varEloB } : { increment: varEloB },
            },
        });

        return variation;
    }
}
