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
    BALL_RADIUS,
    WINNING_SCORE,
    BALL_SPEED_INCREMENT,
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
    DEFAULT_CLASSIC_OBJECTS,
    DEFAULT_MAYHEM_OBJECTS,
    DEFAULT_BATTLE_OBJECTS,
    ClassicGameObjects,
} from 'src/shared/game_info';
import { GameMode, MAX_PLAYERS } from 'src/shared/misc';

class Game {
    id: string;
    timeStarted: number;
    info: GameInfo;
    private lastUpdate: number;

    constructor(gameId: string, gameMode: GameMode, firstPlayer: string) {
        this.lastUpdate = performance.now();
        this.id = gameId;
        this.info = {
            state: 'waiting',
            players: new Array(MAX_PLAYERS[gameMode]).fill(null),
            timeRemaining: 0,
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
        objects.ballVelX = randomChoice([-BALL_SPEED_START, BALL_SPEED_START]);
        objects.ballVelY =
            randomFloat(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START;
    }

    addPlayer(playerId: string) {
        const emptyIdxs = [...this.info.players.keys()].filter(
            (i) => !this.info.players[i],
        );
        const idx = emptyIdxs[randomInt(0, emptyIdxs.length - 1)];
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
        this.info.timeRemaining = Math.max(0, 3000 - (now - this.timeStarted));
        if (this.info.timeRemaining > 0) return;
        switch (this.info.mode) {
            case 'classic':
                this.updateClassic(this.info.objects, deltaTime);
                break;
        }
    }
}

export default Game;
