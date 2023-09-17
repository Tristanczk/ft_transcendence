import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';
import { CreateMessageDto } from 'src/chat/dto/message.dto';
import Game from './Game';
import { randomInt } from 'src/shared/functions';
import { ApiResult, KeyEvent, isGameMode } from 'src/shared/misc';
import { IndivUser, ResponseCheckConnexion, Users } from './gateway.users';
import {
    BattlePlayer,
    BattlePlayers,
    ClassicMayhemPlayer,
    ClassicMayhemPlayers,
    GameInfo,
    UpdateGameEvent,
} from 'src/shared/game_info';
import { GamesService } from 'src/games/games.service';
import { emit } from 'process';

const ID_SIZE = 6;
const ID_BASE = 36;
const ID_MAX = ID_BASE ** ID_SIZE - 1;

const generateId = (games: Record<string, Game>) => {
    while (true) {
        const id = randomInt(0, ID_MAX).toString(36).padStart(ID_SIZE, '0');
        if (!games[id]) {
            return id;
        }
    }
};

export type SocketProps = {
    id: number;
    idConnection: string;
    nb: number;
    date: number;
};

interface PingProps {
    id: number;
    idConnection: string;
}

export type HandlePingProp = {
    idUser: number;
    type: 'in' | 'out';
};

export type JoinGameType = {
    mode: string;
    userId: number;
};

@Injectable()
@WebSocketGateway({
    cors: {
        origin: [`http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`],
    },
})
export class GatewayService
    implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection
{
    constructor(
        private prisma: PrismaService,
        private gamesService: GamesService,
    ) {}

    socketArray: SocketProps[] = [];

    users: Users = new Users(this.prisma);

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {});
    }

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() body: PingProps) {
        // console.log(body);
        const toNotify: ResponseCheckConnexion =
            await this.users.checkUserAlreadyHere(body.id, body.idConnection);
        if (toNotify.inNotify) {
            this.server.emit('updateStatus', { idUser: body.id, type: 'come' });
        }
        if (toNotify.outNotify && toNotify.outId !== -1) {
            this.server.emit('updateStatus', {
                idUser: toNotify.outId,
                type: 'leave',
            });
            setTimeout(() => {
                this.users.handleDeconnexionCase(toNotify.outId);
            }, 3000);
        }
    }

    handleDisconnect(client: Socket) {
        this.users.removeUser(client.id);
    }

    handleConnection(client: Socket) {}

    @Interval(1000)
    async handleInterval() {
        const tab: number[] = await this.users.checkConnections();
        for (const elem of tab) {
            if (elem !== -1)
                this.server.emit('updateStatus', {
                    idUser: elem,
                    type: 'leave',
                });
        }
    }

    /*********** Axel WIP ***********/

    private games: Record<string, Game> = {};
    private clients: Record<string, IndivUser | null> = {}; //<socketId, client>
    private spectators: Record<string, Set<string>> = {};
    private spectating: Record<string, string> = {};

    getGameStatus(userId: number): { status: string; gameId: string } {
        const client: IndivUser | null = this.users.getIndivUserById(userId);
        if (!client) {
            return { status: 'not connected', gameId: null };
        }
        const game = this.games[client.idGamePlaying];
        if (client.isPlaying) {
            if (game.info.state === 'waiting') {
                return { status: 'waiting', gameId: client.idGamePlaying };
            } else if (game.info.state === 'playing') {
                return { status: 'playing', gameId: client.idGamePlaying };
            } else {
                return { status: 'finished', gameId: client.idGamePlaying };
            }
        }
        return { status: 'not playing', gameId: null };
    }

    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, data: JoinGameType) {
        const gameMode: string = data.mode;
        const playerId: number = data.userId;
        const currentClient: IndivUser | null =
            this.users.getIndivUserBySocketId(client.id);

        if (!currentClient) {
            console.log('error to handle');
            return;
        }
        console.log('player ' + playerId + ' want to play');
        if (currentClient.isPlaying) {
            if (
                this.games[currentClient.idGamePlaying].info.state === 'waiting'
            ) {
                return {
                    error: `You are already in matchmaking for game ${currentClient.idGamePlaying} in another tab`,
                    errorCode: 'alreadyInMatchmaking',
                    gameId: currentClient.idGamePlaying,
                };
            } else {
                return {
                    error: `You are already in game ${currentClient.idGamePlaying}`,
                    errorCode: 'alreadyInGame',
                    gameId: currentClient.idGamePlaying,
                };
            }
        }
        if (!isGameMode(gameMode)) {
            return {
                error: `Invalid game mode: ${gameMode}`,
                errorCode: 'invalidGameMode',
            };
        }
        for (const game of Object.values(this.games)) {
            if (game.info.mode === gameMode && game.info.state === 'waiting') {
                game.addPlayer(client.id, false);
                this.liaiseGameToPlayer(client.id, game, 'B');

                for (const player of game.info.players) {
                    if (player && player.id !== client.id) {
                        this.server.to(player.id).emit('startGame', game.id);
                    }
                }

                await this.startGameStat(game);
                return { gameId: game.id, status: 'joined' };
            }
        }
        const game = new Game(generateId(this.games), gameMode, client.id);
        this.games[game.id] = game;
        this.liaiseGameToPlayer(client.id, game, 'A');
        return { gameId: game.id, status: 'waiting' };
    }

    //on ne prend pas en compte le mode multiplayer (battle)
    async startGameStat(game: Game) {
        const idPlayerA: number = game.playerA.userId;
        const idPlayerB: number = game.playerB.userId;
        let mode: number = -1;
        if (game.info.mode === 'classic') mode = 0;
        else if (game.info.mode === 'mayhem') mode = 1;

        if (mode !== -1)
            game.idGameStat = await this.gamesService.initGame(
                idPlayerA,
                idPlayerB,
                mode,
            );

        if (idPlayerA !== -1) {
            this.server.emit('updateStatus', {
                idUser: idPlayerA,
                type: 'startPlaying',
            });
            game.playerA.updateStatusUserPlayingDB(true);
        }

        if (idPlayerB !== -1) {
            this.server.emit('updateStatus', {
                idUser: idPlayerB,
                type: 'startPlaying',
            });
            game.playerB.updateStatusUserPlayingDB(true);
        }
    }

    liaiseGameToPlayer(
        socketId: string,
        game: Game,
        playerPos: 'A' | 'B',
    ): boolean {
        const player: IndivUser | null =
            this.users.getIndivUserBySocketId(socketId);
        if (player) {
            player.setIsPlaying(game.id);
            this.clients[socketId] = player;
            if (playerPos === 'A') game.playerA = player;
            else game.playerB = player;

            return true;
        } else {
            return false;
        }
    }

    //TODO: adapt for userId rather than socketId
    @SubscribeMessage('abortMatchmaking')
    async handleAbortMatchmaking(client: Socket, gameId: string) {
        if (!this.games[gameId]) {
            return {
                error: `Invalid game: ${gameId}`,
                errorCode: 'invalidGame',
            };
        }
        if (this.games[gameId].info.state !== 'waiting') {
            return {
                error: `Game ${gameId} has already started`,
                errorCode: 'gameStarted',
            };
        }
        const gameToAbort: Game = this.games[gameId];
        this.handleEndGame(gameToAbort, false, -1);
        return { status: 'matchmaking cancelled' };
    }

    @SubscribeMessage('quitGame')
    async handleQuitGame(client: Socket, data: string) {
        if (!this.games[data])
            return { gameId: data, message: 'invalid gameId' };
        const game = this.games[data];
        const userAborting: IndivUser = this.users.getIndivUserBySocketId(
            client.id,
        );
        if (!userAborting) return { gameId: data, message: 'invalid user' };
        console.log(game.playerA.sockets);
        console.log(game.playerB.sockets);
        if (
            !(
                game.playerA.sockets.includes(client.id) ||
                game.playerB.sockets.includes(client.id)
            )
        ) {
            return { gameId: data, message: 'invalid rights for user' };
        }
        console.log('try mode');
        //si game existe + si user existe + si client a les droits, alors on aborte le jeu
        if (game.info.mode === 'classic' || game.info.mode === 'mayhem') {
            if (game.playerA.sockets.includes(client.id)) {
                this.handleEndGame(game, true, 0);
            } else if (game.playerB.sockets.includes(client.id)) {
                this.handleEndGame(game, true, 1);
            }
            game.info.state = 'finished';
            console.log('game finished : ' + data);
            const returnData: UpdateGameEvent = {
                gameId: data,
                message: 'game aborted by user',
                from: client.id,
            };
            this.emitUpdateToPlayers(game, 'eventGame', returnData);
            return { gameId: data, message: 'game aborted' };
        }

        return { gameId: data, message: 'game not aborted' };
    }

    private timeDisconnection: number = 5000;
    @Interval(1000)
    checkUserStillPlaying() {
        for (const game of Object.values(this.games)) {
            if (game.info.state !== 'finished') {
                if (
                    game.info.mode === 'classic' ||
                    game.info.mode === 'mayhem'
                ) {
                    if (
                        (game.playerA && game.playerA.isConnected === false) ||
                        (game.playerB && game.playerB.isConnected === false)
                    ) {
                        let returnData: UpdateGameEvent = {
                            gameId: game.id,
                            message: '',
                        };
                        const timeNow: number = Date.now();
                        //check si premiere fois
                        if (game.timeUserLeave === 0) {
                            game.timeUserLeave = Date.now();
                            returnData.message = 'user leave';
                            returnData.timeLeft = this.timeDisconnection;
                        } else if (
                            timeNow - game.timeUserLeave <
                            this.timeDisconnection
                        ) {
                            //faire le décompte
                            returnData.message = 'user leave';
                            returnData.timeLeft =
                                this.timeDisconnection -
                                (timeNow - game.timeUserLeave);
                        } else {
                            //end game
                            returnData.message = 'user left';
                            returnData.timeLeft = 0;

                            if (
                                game.playerA &&
                                game.playerA.isConnected === false &&
                                game.playerB &&
                                game.playerB.isConnected
                            ) {
                                this.handleEndGame(game, true, 0);
                            } else if (
                                game.playerB &&
                                game.playerB.isConnected === false &&
                                game.playerA &&
                                game.playerA.isConnected
                            ) {
                                this.handleEndGame(game, true, 1);
                            }
                            game.info.state = 'finished';
                            console.log('game finished : ' + game.id);
                        }

                        this.emitUpdateToPlayers(game, 'eventGame', returnData);
                    } else if (game.timeUserLeave !== 0) {
                        game.timeUserLeave = 0;
                        const returnData: UpdateGameEvent = {
                            gameId: game.id,
                            message: 'user back',
                        };
                        this.emitUpdateToPlayers(game, 'eventGame', returnData);
                    }
                }
            }
        }
    }

    @SubscribeMessage('leavePage')
    async handleLeavePage(client: Socket, data: string) {
        // TODO only player
        // TODO not in game
        // TODO waiting
        // TODO playing
        // TODO finished
    }

    @SubscribeMessage('keyEvent')
    async handleKeyEvent(client: Socket, keyEvent: KeyEvent) {
        if (!this.games[keyEvent.gameId]) {
            return;
        }
        const gameInfo = this.games[keyEvent.gameId].info;
        let user: IndivUser = null;
        for (const player of gameInfo.players) {
            // oblige de separer en 2... desole !
            if (gameInfo.mode === 'classic' || gameInfo.mode === 'mayhem') {
                if (player.side === this.games[keyEvent.gameId].sidePlayerA)
                    user = this.games[keyEvent.gameId].playerA;
                else user = this.games[keyEvent.gameId].playerB;
                if (player && user.sockets.includes(client.id)) {
                    if (keyEvent.type === 'down') {
                        player.activeKeys.add(keyEvent.key);
                    } else {
                        player.activeKeys.delete(keyEvent.key);
                    }
                }
            } else {
                if (player && player.id === client.id) {
                    if (keyEvent.type === 'down') {
                        player.activeKeys.add(keyEvent.key);
                    } else {
                        player.activeKeys.delete(keyEvent.key);
                    }
                }
            }
        }
    }

    @SubscribeMessage('getGameInfo')
    async handleGetGameInfo(
        client: Socket,
        gameId: string,
    ): Promise<ApiResult<GameInfo>> {
        if (!this.games[gameId]) {
            return { success: false, error: `Invalid game: ${gameId}` };
        }
        return {
            success: true,
            data: this.games[gameId].info,
        };
    }

    @SubscribeMessage('startBattle')
    async handleStartBattle(client: Socket, data: string) {
        // TODO refuse if only one player
        // TODO refuse if already started
        // TODO refuse if not in game
    }

    @Interval(1000 / 60)
    async notifyUsers() {
        let retourUpdate: string = null;
        for (const game of Object.values(this.games)) {
            if (game.info.state !== 'finished') {
                retourUpdate = game.update();
                if (retourUpdate === 'finished') {
                    this.handleEndGame(game, true, -1);
                }
                this.emitUpdateToPlayers(game, 'updateGameInfo', game.info);
            }
        }
    }

    // /!\ /!\ /!\ a retravailler pour inclure le mode battle /!\ /!\ /!\
    emitUpdateToPlayers(game: Game, canal: string, dataToTransfer: any) {
        if (game.info.mode === 'classic' || game.info.mode === 'mayhem') {
            if (game.playerA)
                this.emitUpdateToPlayer(game.playerA, canal, dataToTransfer);
            if (game.playerB)
                this.emitUpdateToPlayer(game.playerB, canal, dataToTransfer);
        } else {
            for (const player of game.info.players) {
                if (player) {
                    this.server.to(player.id).emit('updateGameInfo', game.info);
                }
            }
        }
    }

    emitUpdateToPlayer(player: IndivUser, canal: string, dataToTransfer: any) {
        for (const socketId of player.sockets) {
            this.server.to(socketId).emit(canal, dataToTransfer);
        }
    }

    //aborted: -1: classic ending, 0: aborted by A, 1: aborted by B
    async handleEndGame(game: Game, update: boolean, aborted: number) {
        this.emitUpdateToPlayers(game, 'endGame', { message: 'game ended' });
        if (game.playerA && game.playerA.userId !== -1)
            this.server.emit('updateStatus', {
                idUser: game.playerA.userId,
                type: 'endPlaying',
            });
        if (game.playerB && game.playerB.userId !== -1)
            this.server.emit('updateStatus', {
                idUser: game.playerB.userId,
                type: 'endPlaying',
            });

        if (!(game.info.mode === 'classic' || game.info.mode === 'mayhem'))
            return;

        if (update) {
            const players: ClassicMayhemPlayers = game.info.players;

            let scoreA: number = 0;
            let scoreB: number = 0;
            let result: boolean = false;

            if (game.playerA.sockets.includes(players[0].id)) {
                scoreA = players[0].score;
                scoreB = players[1].score;
            } else {
                scoreA = players[1].score;
                scoreB = players[0].score;
            }
            result = scoreA > scoreB ? true : false;
            if (aborted === 0) result = false;
            else if (aborted === 1) result = true;

            try {
                await this.gamesService.updateGame(game.idGameStat, {
                    scoreA: scoreA,
                    scoreB: scoreB,
                    won: result,
                    aborted: aborted === -1 ? false : true,
                });
            } catch (error) {}
        }

        if (game.playerA) {
            game.playerA.isPlaying = false;
            game.playerA.idGamePlaying = null;
            if (game.playerA.userId !== -1)
                game.playerA.updateStatusUserPlayingDB(false);
        }
        if (game.playerB) {
            game.playerB.isPlaying = false;
            game.playerB.idGamePlaying = null;
            if (game.playerB.userId !== -1)
                game.playerB.updateStatusUserPlayingDB(false);
        }
        delete this.games[game.id];
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() messageBody: CreateMessageDto) {
        /*
        get all user of messageBody.idChannel
        for each user
            for socket in user
                this.socket.to(userid).emit('message', messageBody)
        */
        console.log(messageBody);
    }
}
