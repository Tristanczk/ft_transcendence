import {
    BALL_SPEED_START,
    MAX_Y_FACTOR,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
    COLLISION_X,
    COLLISION_Y,
    PADDLE_SPEED,
    PADDLE_LOW,
    PADDLE_HIGH,
    BALL_LOW,
    BALL_HIGH,
    WINNING_SCORE_CLASSIC,
    WINNING_SCORE_MAYHEM,
    BALL_SPEED_INCREMENT,
    BALL_WIDTH,
} from 'src/shared/classic_mayhem';
import {
    remap,
    clamp,
    randomChoice,
    randomFloat,
    randomInt,
} from 'src/shared/functions';
import {
    GameInfo,
    ClassicMayhemGameObjects,
    MultiBall,
    getDefaultClassicObjects,
    getDefaultMayhemObjects,
    getDefaultBattleObjects,
    ClassicMayhemPlayers,
    BattlePlayer,
    ClassicMayhemPlayer,
    GameState,
} from 'src/shared/game_info';
import { hitMayhemMap } from 'src/shared/mayhem_maps';
import { GameMode, MAX_PLAYERS, TAU } from 'src/shared/misc';
import { IndivUser } from './gateway.users';

class Game {
    id: string;
    timeStarted: number;
    info: GameInfo;
    idGameStat: number;
    playerA: IndivUser | null;
    playerB: IndivUser | null;
    sidePlayerA: number; //to find the user
    sidePlayerB: number; //to find the user
    timeUserLeave: number;
    opponentId: number;
    isFriendly: boolean;
    private lastUpdate: number;

    constructor(
        gameId: string,
        gameMode: GameMode,
        firstPlayer: string,
        userName: string,
        userElo: number,
        opponent?: number,
        friendly?: boolean,
    ) {
        this.lastUpdate = performance.now();
        this.id = gameId;
        this.info = {
            state: 'waiting',
            players: new Array(MAX_PLAYERS[gameMode]).fill(null),
            timeRemaining: 0,
            ...(gameMode === 'classic'
                ? { mode: gameMode, objects: getDefaultClassicObjects() }
                : gameMode === 'mayhem'
                ? { mode: gameMode, objects: getDefaultMayhemObjects() }
                : { mode: gameMode, objects: getDefaultBattleObjects() }),
        };
        this.sidePlayerA = 0;
        this.sidePlayerB = 0;
        this.timeUserLeave = 0;
        this.addPlayer(firstPlayer, true, userName, userElo);
        this.idGameStat = -1;
        this.playerA = null;
        this.playerB = null;
        this.opponentId = opponent || -1;
        this.isFriendly = friendly || false;
    }

    public update(): GameState {
        if (this.info.mode === 'battle') return;
        const now = performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        this.info.timeRemaining = Math.max(0, this.timeStarted + 5000 - now);
        this.updateClassicMayhem(
            this.info.players,
            this.info.objects,
            deltaTime,
        );
        return this.info.state;
    }

    private getNumPlayers() {
        return (
            this.info.players as (BattlePlayer | ClassicMayhemPlayer | null)[]
        ).reduce<number>((a, b) => a + (b ? 1 : 0), 0);
    }

    addPlayer(
        playerId: string,
        arrivedFirst: boolean,
        userName: string,
        userElo: number,
    ) {
        if (this.info.mode === 'battle') return;
        const emptyIdxs = [...this.info.players.keys()].filter(
            (i) => !this.info.players[i],
        );
        const idx = emptyIdxs[randomInt(0, emptyIdxs.length - 1)];
        const numPlayers = this.getNumPlayers() + 1;
        this.info.players[idx] = {
            id: playerId,
            name: userName,
            elo: userElo,
            side: idx,
            pos: 0.5,
            score: 0,
            activeKeys: new Set(),
        };
        if (arrivedFirst) this.sidePlayerA = idx;
        else this.sidePlayerB = idx;
        if (numPlayers === 2) {
            this.info.state = 'playing';
            this.timeStarted = performance.now();
            for (const ball of this.info.objects.balls) {
                this.resetBallClassicMayhem(ball);
            }
        }
        this.update();
    }

    private resetBallClassicMayhem(ball: MultiBall) {
        ball.posX = 0.5;
        ball.posY = 0.5;
        ball.velX = randomChoice([-BALL_SPEED_START, BALL_SPEED_START]);
        ball.velY = randomFloat(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START;
    }

    private hitPaddleClassicMayhem(
        ball: MultiBall,
        players: ClassicMayhemPlayers,
        playerIdx: 0 | 1,
    ): number | null {
        const x = playerIdx === 0 ? ball.posX : 1 - ball.posX;
        if (PADDLE_MARGIN_X + PADDLE_WIDTH / 2 <= x && x <= COLLISION_X) {
            const paddleDiff = ball.posY - players[playerIdx].pos;
            if (Math.abs(paddleDiff) <= COLLISION_Y) {
                return (
                    remap(paddleDiff, 0, COLLISION_Y, 0, MAX_Y_FACTOR) *
                    Math.abs(ball.velX)
                );
            }
        }
        return null;
    }

    private updateClassicMayhem(
        players: ClassicMayhemPlayers,
        objects: ClassicMayhemGameObjects,
        deltaTime: number,
    ) {
        for (const player of players) {
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
        if (this.info.state !== 'playing' || this.info.timeRemaining > 0)
            return;
        const ballRadius = BALL_WIDTH / 2;
        for (const ball of objects.balls) {
            ball.posX += ball.velX * deltaTime;
            ball.posY += ball.velY * deltaTime;
            if (ball.posY <= BALL_LOW || ball.posY >= BALL_HIGH) {
                ball.posY = clamp(ball.posY, BALL_LOW, BALL_HIGH);
                ball.velY = -ball.velY;
            }
            if (ball.posX >= 1 + ballRadius) {
                ++players[0].score;
                this.resetBallClassicMayhem(ball);
            } else if (ball.posX <= -ballRadius) {
                ++players[1].score;
                this.resetBallClassicMayhem(ball);
            }
            const winningScore =
                this.info.mode === 'classic'
                    ? WINNING_SCORE_CLASSIC
                    : WINNING_SCORE_MAYHEM;
            if (
                (players[0].score >= winningScore ||
                    players[1].score >= winningScore) &&
                Math.abs(players[0].score - players[1].score) >= 2
            ) {
                this.info.state = 'finished';
                return;
            }
            const newVelY =
                this.hitPaddleClassicMayhem(ball, players, 0) ||
                this.hitPaddleClassicMayhem(ball, players, 1);
            if (newVelY !== null) {
                ball.velX = -(
                    ball.velX +
                    Math.sign(ball.velX) * BALL_SPEED_INCREMENT
                );
                ball.velY = newVelY;
                ball.posX = clamp(ball.posX, COLLISION_X, 1 - COLLISION_X);
            }
            hitMayhemMap(ball, objects.mayhemMap);
        }
    }
}

export default Game;
