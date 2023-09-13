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
import {
    BattlePlayers,
    ClassicMayhemPlayers,
    GameInfo,
} from 'src/shared/game_info';
import { IndivUser, ResponseCheckConnexion, Users } from './gateway.users';
import { GamesService } from 'src/games/games.service';

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

    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, data: JoinGameType) {
        const gameMode: string = data.mode;
        const playerId: number = data.userId;
        const currentClient = this.users.getIndivUserBySocketId(client.id);
        if (!currentClient) {
            console.log('to handle');
            return;
        }
        console.log('player ' + playerId + ' want to play');
        if (currentClient.isPlaying) {
            return {
                error: `You are already in game ${currentClient.idGamePlaying}`,
                errorCode: 'alreadyInGame',
                gameId: currentClient.idGamePlaying,
            };
        }
        if (!isGameMode(gameMode)) {
            return {
                error: `Invalid game mode: ${gameMode}`,
                errorCode: 'invalidGameMode',
            };
        }
        for (const game of Object.values(this.games)) {
            if (game.info.mode === gameMode && game.info.state === 'waiting') {
                game.addPlayer(client.id);
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
        // this.clients[client.id] = game.id;
        return { gameId: game.id, status: 'waiting' };
    }

    //on ne prend pas en compte le mode multiplayer (battle)
    async startGameStat(game: Game) {
        const idPlayerA: number = game.playerA.userId;
        const idPlayerB: number = game.playerB.userId;
        let mode: number = -1;
        if (game.info.mode === 'classic') mode = 0;
        else if (game.info.mode === 'mayhem') mode = 1;

		console.log('new game: playerA=' + idPlayerA + ', playerB=' + idPlayerB + ', mode=' + mode);
        if (mode !== -1)
            game.idGameStat = await this.gamesService.initGame(
                idPlayerA,
                idPlayerB,
                mode,
            );
        console.log('for stats:' + game.idGameStat);
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

            console.log(
                playerPos +
                    '(' +
                    player.userId +
                    '/' +
                    socketId +
                    ') came, play=' +
                    player.idGamePlaying,
            );

            return true;
        } else {
            console.log('error to handle');
            //TODO and TO TEST (si quelqu'un arrive sur la page et clique instantannement sur le bouton jouer.)
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
		this.handleEndGame(gameToAbort, true);
        // delete this.games[gameId];
        // delete this.clients[client.id];
        return { status: 'matchmaking cancelled' };
    }

    @SubscribeMessage('quitGame')
    async handleQuitGame(client: Socket, data: string) {
        console.log('end');
        // TODO only player
        // TODO not in game
        // TODO waiting
        // TODO playing
        // TODO finished
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
        for (const player of gameInfo.players) {
            if (player && player.id === client.id) {
                if (keyEvent.type === 'down') {
                    player.activeKeys.add(keyEvent.key);
                } else {
                    player.activeKeys.delete(keyEvent.key);
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
                    this.handleEndGame(game, true);
                }
                for (const player of game.info.players) {
                    if (player) {
                        this.server
                            .to(player.id)
                            .emit('updateGameInfo', game.info);
                    }
                }
            }
        }
    }

    async handleEndGame(game: Game, update: boolean) {
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
			}
			else {
				scoreA = players[1].score;
				scoreB = players[0].score;
			}
			result = scoreA > scoreB ? true : false;

			// console.log('player[0]=' + players[0].id + ' vs player[1]=' + players[1].id)

			// console.log('playerA=' + game.playerA.userId + ', score=' + scoreA + ', won=' + result)
			// console.log(game.playerA.sockets)

			// console.log('playerB=' + game.playerB.userId + ', score=' + scoreB)
			// console.log(game.playerB.sockets)

            try {
                await this.gamesService.updateGame(game.idGameStat, {
                    scoreA: scoreA,
                    scoreB: scoreB,
                    won: scoreA > scoreB ? true : false,
                });
            } catch (error) {}
        }

        if (game.playerA) {
            game.playerA.isPlaying = false;
            game.playerA.idGamePlaying = null;
        }
        if (game.playerB) {
            game.playerB.isPlaying = false;
            game.playerB.idGamePlaying = null;
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
