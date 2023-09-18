import {
    BATTLE_BALL_SIZE,
    BATTLE_BALL_SPEED_INCREMENT,
    BATTLE_COLORS,
    BATTLE_DEFAULT_PADDLE_SIZE,
    BATTLE_HIT_ANGLE_FACTOR,
    BATTLE_HIT_LEEWAY,
    BATTLE_HIT_PADDLE,
    BATTLE_PADDLE_MARGIN,
    BATTLE_PADDLE_SPEED,
    BATTLE_PADDLE_WIDTH,
    avoidCollisions,
    getBallSpeedStart,
    getBattleLives,
    getRandomPlayer,
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
    BALL_WIDTH,
} from 'src/shared/classic_mayhem';
import {
    remap,
    clamp,
    randomChoice,
    randomFloat,
    randomInt,
    angleDist,
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
import { hitMayhemMap } from 'src/shared/mayhem_maps';
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
        this.addPlayer(firstPlayer);
    }

    public update() {
        const now = performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        this.info.timeRemaining = Math.max(0, this.timeStarted + 3000 - now);
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
                angle: idx + TAU / 6,
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
                this.info.objects.currentPlayer = getRandomPlayer(
                    this.info.players,
                );
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

    private hitPaddleBattle(player: BattlePlayer, ball: MultiBall) {
        const ballAngle = Math.atan2(ball.posY, ball.posX);
        const angleDiff = angleDist(player.angle, ballAngle);
        const limit =
            BATTLE_DEFAULT_PADDLE_SIZE + BATTLE_BALL_SIZE * BATTLE_HIT_LEEWAY;
        return Math.abs(angleDiff) <= limit ? angleDiff / limit : null;
    }

    private bounceBattle(ball: MultiBall, hit: number) {
        const posMag = Math.hypot(ball.posY, ball.posX);
        const posFactor = BATTLE_HIT_PADDLE / posMag;
        ball.posX *= posFactor;
        ball.posY *= posFactor;
        const newVelAngle =
            Math.atan2(ball.posY, ball.posX) +
            Math.PI -
            hit * BATTLE_HIT_ANGLE_FACTOR;
        const newVelMag =
            Math.hypot(ball.velX, ball.velY) + BATTLE_BALL_SPEED_INCREMENT;
        ball.velX = Math.cos(newVelAngle) * newVelMag;
        ball.velY = Math.sin(newVelAngle) * newVelMag;
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
        if (this.info.state !== 'playing' || this.info.timeRemaining > 0)
            return;
        objects.ball.posX += objects.ball.velX * deltaTime;
        objects.ball.posY += objects.ball.velY * deltaTime;
        const centerDist = Math.hypot(objects.ball.posX, objects.ball.posY);
        if (centerDist >= 1 + BATTLE_BALL_SIZE) {
            --players[objects.currentPlayer].lives;
            if (players[objects.currentPlayer].lives === 0) {
                this.info.players = players.filter(
                    (_, i) => i !== objects.currentPlayer,
                );
                objects.currentPlayer = getRandomPlayer(this.info.players);
            } else {
                objects.currentPlayer = getRandomPlayer(
                    this.info.players,
                    objects.currentPlayer,
                );
            }
            this.resetBallBattle(objects.ball);
        } else if (
            centerDist >= BATTLE_HIT_PADDLE &&
            centerDist <= 1 - BATTLE_PADDLE_MARGIN - BATTLE_PADDLE_WIDTH / 2
        ) {
            let closestHit: number | null = null;
            for (const player of players) {
                if (!player) continue;
                const hit = this.hitPaddleBattle(player, objects.ball);
                if (
                    hit !== null &&
                    (closestHit === null ||
                        Math.abs(hit) < Math.abs(closestHit))
                ) {
                    closestHit = hit;
                }
            }
            if (closestHit !== null) {
                this.bounceBattle(objects.ball, closestHit);
                objects.currentPlayer = getRandomPlayer(
                    this.info.players,
                    objects.currentPlayer,
                );
            }
        }
    }
}

export default Game;
