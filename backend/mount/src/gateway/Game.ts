import {
    BATTLE_COLORS,
    BATTLE_PADDLE_SPEED,
    avoidCollisions,
    getBallSpeedStart,
    getBattleLives,
} from 'src/shared/battle';
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
    BALL_HEIGHT,
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
    BattleGameObjects,
    ClassicMayhemPlayers,
    BattlePlayers,
    BattlePlayer,
    ClassicMayhemPlayer,
} from 'src/shared/game_info';
import {
    MayhemMap,
    MayhemMapCollision,
    getMayhemCellPos,
    randomMap,
} from 'src/shared/mayhem_maps';
import { GameMode, MAX_PLAYERS, TAU } from 'src/shared/misc';

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
                ? { mode: gameMode, objects: getDefaultClassicObjects() }
                : gameMode === 'mayhem'
                ? { mode: gameMode, objects: getDefaultMayhemObjects() }
                : { mode: gameMode, objects: getDefaultBattleObjects() }),
        };
        if (this.info.mode === 'mayhem') {
            this.info.objects.mayhemMap = randomMap();
        }
        this.addPlayer(firstPlayer);
    }

    public update() {
        const now = performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        this.info.timeRemaining = Math.max(0, 3000 - (now - this.timeStarted));
        if (this.info.timeRemaining > 0) return;
        if (this.info.mode === 'battle') {
            this.updateBattle(this.info.players, this.info.objects, deltaTime);
        } else {
            this.updateClassicMayhem(
                this.info.players,
                this.info.objects,
                deltaTime,
            );
        }
    }

    private getNumPlayers() {
        return (
            this.info.players as (BattlePlayer | ClassicMayhemPlayer | null)[]
        ).reduce<number>((a, b) => a + (b ? 1 : 0), 0);
    }

    public addPlayer(playerId: string) {
        const emptyIdxs = [...this.info.players.keys()].filter(
            (i) => !this.info.players[i],
        );
        const idx = emptyIdxs[randomInt(0, emptyIdxs.length - 1)];
        const numPlayers = this.getNumPlayers() + 1;
        if (this.info.mode === 'battle') {
            const lives = getBattleLives(numPlayers);
            this.info.players[idx] = {
                id: playerId,
                angle: 0,
                lives: lives,
                color: BATTLE_COLORS[idx],
                activeKeys: new Set(),
            };
            for (const player of this.info.players) {
                if (player) {
                    player.lives = lives;
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
        if (numPlayers === 2) {
            this.info.state = 'playing';
            this.timeStarted = performance.now();
            if (this.info.mode === 'battle') {
                this.resetBallBattle(this.info.objects.ball);
            } else {
                for (const ball of this.info.objects.balls) {
                    this.resetBallClassicMayhem(ball);
                }
            }
        }
        this.update();
    }

    /***************************************************************************
     **************************** CLASSIC & MAYHEM *****************************
     **************************************************************************/

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

    private hitMayhemCell(
        ball: MultiBall,
        gridX: number,
        gridY: number,
    ): MayhemMapCollision | null {
        const { posX, posY } = getMayhemCellPos(gridX, gridY);
        const left = posX - BALL_WIDTH;
        const right = posX + BALL_WIDTH;
        const top = posY - BALL_HEIGHT;
        const bottom = posY + BALL_HEIGHT;
        if (
            ball.posX <= left ||
            ball.posX >= right ||
            ball.posY <= top ||
            ball.posY >= bottom
        )
            return null;
        const distances = [
            ball.velY <= 0
                ? Infinity
                : Math.abs(ball.posY - top) / Math.abs(ball.velY),
            ball.velX >= 0
                ? Infinity
                : Math.abs(ball.posX - right) / Math.abs(ball.velX),
            ball.velY >= 0
                ? Infinity
                : Math.abs(ball.posY - bottom) / Math.abs(ball.velY),
            ball.velX <= 0
                ? Infinity
                : Math.abs(ball.posX - left) / Math.abs(ball.velX),
        ];
        const collisionSide = distances.indexOf(Math.min(...distances));
        let newPosX = ball.posX;
        let newPosY = ball.posY;
        let newVelX = ball.velX;
        let newVelY = ball.velY;
        if (collisionSide === 0) {
            newVelY = -ball.velY;
            newPosY = top;
        } else if (collisionSide === 1) {
            newVelX = -ball.velX;
            newPosX = right;
        } else if (collisionSide === 2) {
            newVelY = -ball.velY;
            newPosY = bottom;
        } else {
            newVelX = -ball.velX;
            newPosX = left;
        }
        const surface =
            collisionSide & 1
                ? Math.min(distances[0], distances[2]) / BALL_HEIGHT
                : Math.min(distances[1], distances[3]) / BALL_WIDTH;
        return { surface, gridX, gridY, newPosX, newPosY, newVelX, newVelY };
    }

    private hitMayhemMap = (ball: MultiBall, mayhemMap: MayhemMap) => {
        let bestCollision: MayhemMapCollision | null = null;
        for (let y = 0; y < mayhemMap.length; ++y) {
            const row = mayhemMap[y];
            for (let x = 0; x < row.length; ++x) {
                const mayhemCell = row[x];
                if (mayhemCell.lives > 0) {
                    const collision = this.hitMayhemCell(ball, x, y);
                    if (
                        collision &&
                        (!bestCollision ||
                            collision.surface > bestCollision.surface)
                    ) {
                        bestCollision = collision;
                    }
                }
            }
        }
        if (bestCollision) {
            ball.posX = bestCollision.newPosX;
            ball.posY = bestCollision.newPosY;
            ball.velX = bestCollision.newVelX;
            ball.velY = bestCollision.newVelY;
            --mayhemMap[bestCollision.gridY][bestCollision.gridX].lives;
        }
    };

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
        if (this.info.state !== 'playing') return;
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
            this.hitMayhemMap(ball, objects.mayhemMap);
        }
    }

    /***************************************************************************
     ********************************* BATTLE **********************************
     **************************************************************************/

    private resetBallBattle(ball: MultiBall) {
        ball.posX = 0;
        ball.posY = 0;
        const angle = randomFloat(0, TAU);
        const ballSpeedStart = getBallSpeedStart(this.getNumPlayers());
        ball.velX = Math.cos(angle) * ballSpeedStart;
        ball.velY = Math.sin(angle) * ballSpeedStart;
    }

    private updateBattle(
        players: BattlePlayers,
        objects: BattleGameObjects,
        deltaTime: number,
    ) {
        const paddleSpeed = BATTLE_PADDLE_SPEED * deltaTime;
        for (const player of players) {
            if (player) {
                if (player.activeKeys.has('ArrowRight')) {
                    player.angle -= paddleSpeed;
                }
                if (player.activeKeys.has('ArrowLeft')) {
                    player.angle += paddleSpeed;
                }
            }
        }
        avoidCollisions(players);
        console.log(this.info.state);
        if (this.info.state !== 'playing') return;
        objects.ball.posX += objects.ball.velX * deltaTime;
        objects.ball.posY += objects.ball.velY * deltaTime;
        console.log(objects.ball);
        // if (ball.posY <= BALL_LOW || ball.posY >= BALL_HIGH) {
        //     ball.posY = clamp(ball.posY, BALL_LOW, BALL_HIGH);
        //     ball.velY = -ball.velY;
        // }
        // if (ball.posX >= 1 + BALL_RADIUS) {
        //     ++this.info.players[0].score;
        //     this.resetBallClassicMayhem(ball);
        // } else if (ball.posX <= -BALL_RADIUS) {
        //     ++this.info.players[1].score;
        //     this.resetBallClassicMayhem(ball);
        // }
        // const winningScore =
        //     this.info.mode === 'classic'
        //         ? WINNING_SCORE_CLASSIC
        //         : WINNING_SCORE_MAYHEM;
        // if (
        //     (this.info.players[0].score >= winningScore ||
        //         this.info.players[1].score >= winningScore) &&
        //     Math.abs(
        //         this.info.players[0].score - this.info.players[1].score,
        //     ) >= 2
        // ) {
        //     this.info.state = 'finished';
        //     return;
        // }
        // const newVelY = this.hitPaddleClassicMayhem(ball, 0) || this.hitPaddleClassicMayhem(ball, 1);
        // if (newVelY !== null) {
        //     ball.velX = -(
        //         ball.velX +
        //         Math.sign(ball.velX) * BALL_SPEED_INCREMENT
        //     );
        //     ball.velY = newVelY;
        //     ball.posX = clamp(ball.posX, COLLISION_X, 1 - COLLISION_X);
        // }
        // this.hitMayhemMap(ball, objects.mayhemMap);
    }
}

export default Game;
