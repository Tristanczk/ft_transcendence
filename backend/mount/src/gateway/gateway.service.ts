import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';
import { create as createRandomSeed } from 'random-seed';
import {
    BALL_HIGH,
    BALL_LOW,
    BALL_RADIUS,
    BALL_SPEED_INCREMENT,
    BALL_SPEED_START,
    COLLISION_X,
    COLLISION_Y,
    MAX_Y_FACTOR,
    PADDLE_HIGH,
    PADDLE_LOW,
    PADDLE_MARGIN_X,
    PADDLE_SPEED,
    PADDLE_WIDTH,
    WINNING_SCORE,
} from 'src/shared/classic_mayhem';
import {
    ApiResult,
    GameMode,
    KeyEvent,
    MAX_PLAYERS,
    isGameMode,
} from 'src/shared/misc';
import {
    ClassicGameObjects,
    DEFAULT_BATTLE_OBJECTS,
    DEFAULT_CLASSIC_OBJECTS,
    DEFAULT_MAYHEM_OBJECTS,
    GameInfo,
} from 'src/shared/game_info';

const ID_SIZE = 7;
const ID_BASE = 36;
const ID_MAX = ID_BASE ** ID_SIZE - 1;
const randomGenerator = createRandomSeed();

const generateId = (games: Record<string, Game>) => {
    while (true) {
        const id = randomGenerator
            .intBetween(0, ID_MAX)
            .toString(36)
            .padStart(ID_SIZE, '0');
        if (!games[id]) {
            return id;
        }
    }
};

interface SocketProps {
    id: number;
    idConnection: string;
    nb: number;
    date: number;
}

interface PingProps {
    id: number;
    idConnection: string;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: [`http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`],
    },
})
export class GatewayService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    socketArray: SocketProps[] = [];

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log('new comer:' + socket.id);
        });
    }

    async userArrive(body: PingProps) {
        // console.log('ft_arrive=' + body.id);
        try {
            await this.prisma.user.update({
                where: { id: body.id },
                data: { isConnected: true },
            });
            const alreadyConnected = this.socketArray.findIndex(
                (a) => a.id === body.id,
            );
            this.socketArray.push({
                id: body.id,
                idConnection: body.idConnection,
                nb: 0,
                date: Date.now(),
            });
            if (alreadyConnected === -1) {
                this.server.emit('updateStatus', {
                    idUser: body.id,
                    type: 'come',
                });
            }
        } catch (error) {
            return;
            throw error;
        }
    }

    async userLeave(userId: number) {
        const nbConnexions = this.socketArray.reduce(
            (acc, cur) => acc + (cur.id === userId ? 1 : 0),
            0,
        );
        // console.log('ft_left=' + userId + ', nb_tab_left=' + nbConnexions);
        if (nbConnexions > 0) return;
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { isConnected: false },
            });
            this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
        } catch (error) {
            return;
            throw error;
        }
    }

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() body: PingProps) {
        const id: number = body.id;
        if (id === -1) return;
        const l = this.socketArray.findIndex(
            (a) => a.idConnection === body.idConnection,
        );
        if (l !== -1) {
            this.socketArray[l].nb++;
            this.socketArray[l].date = Date.now();
        } else {
            this.userArrive(body);
        }
    }

    @Interval(1000)
    async handleInterval() {
        const timeNow: number = Date.now();
        let idTmp: number = -1;
        this.socketArray.forEach((arr) => {
            if (arr.id !== -1) {
                if (timeNow - arr.date > 3000) {
                    idTmp = arr.id;
                    arr.id = -1;
                    this.userLeave(idTmp);
                }
            }
        });
        this.socketArray = this.socketArray.filter((arr) => arr.id !== -1);
        // console.log(this.socketArray)
    }

    /*********** Axel WIP ***********/

    private games: Record<string, Game> = {};
    private clients: Record<string, string> = {};
    private spectators: Record<string, Set<string>> = {};
    private spectating: Record<string, string> = {};

    @SubscribeMessage('joinGame')
    async handleJoinGame(client: Socket, gameMode: string) {
        if (this.clients[client.id]) {
            return {
                error: `You are already in game ${this.clients[client.id]}`,
                errorCode: 'alreadyInGame',
                gameId: this.clients[client.id],
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
                this.clients[client.id] = game.id;
                this.server
                    .to(game.info.players[0].id)
                    .emit('startGame', game.id);
                return { gameId: game.id, status: 'joined' };
            }
        }
        const game = new Game(generateId(this.games), gameMode, client.id);
        this.games[game.id] = game;
        this.clients[client.id] = game.id;
        return { gameId: game.id, status: 'waiting' };
    }

    @SubscribeMessage('quitGame')
    async handleQuitGame(client: Socket, data: string) {
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
        for (const game of Object.values(this.games)) {
            if (game.info.state !== 'finished') {
                game.update();
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
}

const clamp = (x: number, min: number, max: number) =>
    x < min ? min : x > max ? max : x;

const remap = (
    x: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
) => ((x - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

class Game {
    id: string;
    info: GameInfo;
    private lastUpdate: number;

    constructor(gameId: string, gameMode: GameMode, firstPlayer: string) {
        this.lastUpdate = performance.now();
        this.id = gameId;
        this.info = {
            state: 'waiting',
            players: new Array(MAX_PLAYERS[gameMode]).fill(null),
            ...(gameMode === 'classic'
                ? { mode: gameMode, objects: DEFAULT_CLASSIC_OBJECTS }
                : gameMode === 'mayhem'
                ? { mode: gameMode, objects: DEFAULT_MAYHEM_OBJECTS }
                : { mode: gameMode, objects: DEFAULT_BATTLE_OBJECTS }),
        };
        this.addPlayer(firstPlayer);
    }

    private resetClassic(objects: ClassicGameObjects) {
        objects.ballPosX = 0.5;
        objects.ballPosY = 0.5;
        objects.ballVelX = [-BALL_SPEED_START, BALL_SPEED_START][
            randomGenerator.intBetween(0, 1)
        ];
        objects.ballVelY =
            randomGenerator.floatBetween(-MAX_Y_FACTOR, MAX_Y_FACTOR) *
            BALL_SPEED_START;
    }

    addPlayer(playerId: string) {
        const emptyIdxs = [...this.info.players.keys()].filter(
            (i) => !this.info.players[i],
        );
        const idx =
            emptyIdxs[randomGenerator.intBetween(0, emptyIdxs.length - 1)];
        if (this.info.mode === 'battle') {
            const numPlayers = MAX_PLAYERS['battle'] - emptyIdxs.length + 1;
            const score = Math.max(2, Math.ceil(10 / numPlayers));
            this.info.players[idx] = {
                id: playerId,
                pos: 0,
                score: score,
                activeKeys: new Set(),
            };
            for (const player of this.info.players) {
                if (player) {
                    player.score = score;
                }
            }
        } else {
            this.info.players[idx] = {
                id: playerId,
                pos: 0.5,
                score: 0,
                activeKeys: new Set(),
            };
        }
        if (emptyIdxs.length === 1) {
            this.info.state = 'playing';
            switch (this.info.mode) {
                case 'classic':
                    this.resetClassic(this.info.objects);
                    break;
            }
        }
        this.update();
    }

    private hitPaddle(
        objects: ClassicGameObjects,
        playerIdx: 0 | 1,
    ): number | null {
        const x = playerIdx === 0 ? objects.ballPosX : 1 - objects.ballPosX;
        if (PADDLE_MARGIN_X + PADDLE_WIDTH / 2 <= x && x <= COLLISION_X) {
            const paddleDiff =
                objects.ballPosY - this.info.players[playerIdx].pos;
            if (Math.abs(paddleDiff) <= COLLISION_Y) {
                return (
                    remap(paddleDiff, 0, COLLISION_Y, 0, MAX_Y_FACTOR) *
                    Math.abs(objects.ballVelX)
                );
            }
        }
        return null;
    }

    private updateClassic(objects: ClassicGameObjects, deltaTime: number) {
        for (const player of this.info.players) {
            if (player) {
                const paddleSpeed = PADDLE_SPEED * deltaTime;
                if (player.activeKeys.has('ArrowUp')) {
                    player.pos -= paddleSpeed;
                }
                if (player.activeKeys.has('ArrowDown')) {
                    player.pos += paddleSpeed;
                }
                player.pos = clamp(player.pos, PADDLE_LOW, PADDLE_HIGH);
            }
        }
        if (this.info.state !== 'playing') return;
        objects.ballPosX += objects.ballVelX * deltaTime;
        objects.ballPosY += objects.ballVelY * deltaTime;
        if (objects.ballPosY <= BALL_LOW || objects.ballPosY >= BALL_HIGH) {
            objects.ballPosY = clamp(objects.ballPosY, BALL_LOW, BALL_HIGH);
            objects.ballVelY = -objects.ballVelY;
        }
        if (objects.ballPosX >= 1 + BALL_RADIUS) {
            ++this.info.players[0].score;
            this.resetClassic(objects);
        } else if (objects.ballPosX <= -BALL_RADIUS) {
            ++this.info.players[1].score;
            this.resetClassic(objects);
        }
        if (
            (this.info.players[0].score >= WINNING_SCORE ||
                this.info.players[1].score >= WINNING_SCORE) &&
            Math.abs(this.info.players[0].score - this.info.players[1].score) >=
                2
        ) {
            this.info.state = 'finished';
            return;
        }
        const newVelY =
            this.hitPaddle(objects, 0) || this.hitPaddle(objects, 1);
        if (newVelY !== null) {
            objects.ballVelX = -(
                objects.ballVelX +
                Math.sign(objects.ballVelX) * BALL_SPEED_INCREMENT
            );
            objects.ballVelY = newVelY;
            objects.ballPosX = clamp(
                objects.ballPosX,
                COLLISION_X,
                1 - COLLISION_X,
            );
        }
    }

    update() {
        const now = performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        switch (this.info.mode) {
            case 'classic':
                this.updateClassic(this.info.objects, deltaTime);
                break;
        }
    }
}
