import React from 'react';
import p5Types from 'p5';
import Sketch from 'react-p5';
import { clamp, trueMod } from '../../shared/functions';
import {
    CANVAS_MARGIN,
    NAVBAR_HEIGHT,
    NEARLY_BLACK,
    TAU,
} from '../../shared/misc';
import {
    BATTLE_DEFAULT_PADDLE_SIZE,
    BATTLE_HIT_LEEWAY,
    BATTLE_ARC_VERTICES,
    BATTLE_DOT_SHIFT,
    BATTLE_PADDLE_MARGIN,
    BATTLE_HIT_PADDLE,
    BATTLE_HIT_ANGLE_FACTOR,
    BATTLE_BETWEEN_PADDLES,
    BATTLE_MAX_HEIGHT,
    BATTLE_BALL_SIZE,
    BATTLE_BALL_SPEED_INCREMENT,
    BATTLE_PADDLE_SPEED,
    BATTLE_PADDLE_WIDTH,
    BATTLE_MAX_PLAYERS,
    BATTLE_MIN_PLAYERS,
    BATTLE_COLORS,
    BATTLE_DOT_RADIUS,
    BATTLE_DEFAULT_PLAYERS,
} from '../../shared/battle';
import { useSearchParams } from 'react-router-dom';

class Player {
    private keys: { clockwise: number; antiClockwise: number };
    readonly color: string;
    angle: number;
    lives: number;

    constructor(
        color: string,
        keyClockwise: number,
        keyAntiClockwise: number,
        startAngle: number,
        startLives: number,
    ) {
        this.lives = startLives;
        this.angle = startAngle;
        this.color = color;
        this.keys = {
            clockwise: keyClockwise,
            antiClockwise: keyAntiClockwise,
        };
    }

    move(p5: p5Types): void {
        const paddleSpeed = BATTLE_PADDLE_SPEED * p5.deltaTime;
        if (p5.keyIsDown(this.keys.clockwise)) {
            this.angle += paddleSpeed;
        }
        if (p5.keyIsDown(this.keys.antiClockwise)) {
            this.angle -= paddleSpeed;
        }
    }

    hit(ballPos: p5Types.Vector): number | null {
        const angleDiff = angleDist(this.angle, ballPos.heading());
        const limit =
            BATTLE_DEFAULT_PADDLE_SIZE + BATTLE_BALL_SIZE * BATTLE_HIT_LEEWAY;
        return Math.abs(angleDiff) <= limit ? angleDiff / limit : null;
    }

    private drawPaddle(
        p5: p5Types,
        innerRadius: number,
        outerRadius: number,
    ): void {
        p5.fill(NEARLY_BLACK);
        p5.beginShape();
        const angles: number[] = Array.from(
            { length: BATTLE_ARC_VERTICES + 1 },
            (_, i) =>
                this.angle +
                (i / BATTLE_ARC_VERTICES - 0.5) *
                    BATTLE_DEFAULT_PADDLE_SIZE *
                    2,
        );
        for (const angle of angles) {
            p5.vertex(p5.cos(angle) * innerRadius, p5.sin(angle) * innerRadius);
        }
        for (const angle of angles.reverse()) {
            p5.vertex(p5.cos(angle) * outerRadius, p5.sin(angle) * outerRadius);
        }
        p5.endShape(p5.CLOSE);
    }

    private drawLife(
        p5: p5Types,
        middleRadius: number,
        angle: number,
        arenaSize: number,
    ) {
        p5.fill(this.color);
        p5.circle(
            p5.cos(angle) * middleRadius,
            p5.sin(angle) * middleRadius,
            BATTLE_PADDLE_WIDTH * arenaSize * BATTLE_DOT_RADIUS,
        );
    }

    private drawLives(p5: p5Types, middleRadius: number, arenaSize: number) {
        if (this.lives === 1) {
            this.drawLife(p5, middleRadius, this.angle, arenaSize);
        } else {
            const startDot =
                this.angle - BATTLE_DOT_SHIFT * BATTLE_DEFAULT_PADDLE_SIZE;
            const angleInc =
                (2 * BATTLE_DOT_SHIFT * BATTLE_DEFAULT_PADDLE_SIZE) /
                (this.lives - 1);
            for (let i = 0; i < this.lives; ++i) {
                this.drawLife(
                    p5,
                    middleRadius,
                    startDot + i * angleInc,
                    arenaSize,
                );
            }
        }
    }

    draw(p5: p5Types, arenaSize: number): void {
        const innerRadius =
            (arenaSize * (1 - BATTLE_PADDLE_MARGIN - BATTLE_PADDLE_WIDTH)) / 2;
        const outerRadius = (arenaSize * (1 - BATTLE_PADDLE_MARGIN)) / 2;
        const middleRadius = (innerRadius + outerRadius) / 2;
        this.drawPaddle(p5, innerRadius, outerRadius);
        this.drawLives(p5, middleRadius, arenaSize);
    }
}

class Ball {
    pos: p5Types.Vector;
    vel: p5Types.Vector;

    constructor(p5: p5Types, speedStart: number) {
        this.pos = p5.createVector(0, 0);
        const angle = p5.random(0, p5.TAU);
        this.vel = p5.createVector(
            p5.cos(angle) * speedStart,
            p5.sin(angle) * speedStart,
        );
    }

    bounce(hit: number): void {
        this.pos.mult(BATTLE_HIT_PADDLE / this.pos.mag());
        this.vel = this.pos
            .copy()
            .rotate(Math.PI - hit * BATTLE_HIT_ANGLE_FACTOR)
            .normalize()
            .mult(this.vel.mag() + BATTLE_BALL_SPEED_INCREMENT);
    }

    move(p5: p5Types): void {
        this.pos.add(this.vel.copy().mult(p5.deltaTime));
    }

    draw(p5: p5Types, arenaSize: number): void {
        p5.fill(NEARLY_BLACK);
        p5.circle(
            this.pos.x * arenaSize * 0.5,
            this.pos.y * arenaSize * 0.5,
            BATTLE_BALL_SIZE * arenaSize,
        );
    }
}

const angleDist = (angle1: number, angle2: number) => {
    angle1 = trueMod(angle1, TAU);
    angle2 = trueMod(angle2, TAU);
    const d1 = angle1 - angle2;
    const d2 = angle1 - angle2 + TAU;
    const d3 = angle1 - angle2 - TAU;
    const ad1 = Math.abs(d1);
    const ad3 = Math.abs(d3);
    return ad1 <= d2 && ad1 <= ad3 ? d1 : d2 <= ad3 ? d2 : d3;
};

const getRandomPlayer = (
    numPlayers: number,
    previousPlayer: number | null = null,
) => {
    while (true) {
        const player = Math.floor(Math.random() * numPlayers);
        if (player !== previousPlayer) {
            return player;
        }
    }
};

const gameOver = (p5: p5Types, arenaSize: number) => {
    p5.textFont('monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(8 + arenaSize / 30);
    p5.fill(NEARLY_BLACK);
    p5.text('Game Over!', 0, 0);
    p5.noLoop();
};

const avoidCollision = (
    player1: Player,
    player2: Player,
    step: number,
): boolean => {
    const angleDiff = angleDist(player1.angle, player2.angle);
    const limit = 2 * BATTLE_DEFAULT_PADDLE_SIZE + BATTLE_BETWEEN_PADDLES;
    if (Math.abs(angleDiff) >= limit) return false;
    const toMove = Math.min((limit - Math.abs(angleDiff)) / 2 + 1e-5, step);
    if (angleDiff > 0) {
        player1.angle += toMove;
        player2.angle -= toMove;
    } else {
        player1.angle -= toMove;
        player2.angle += toMove;
    }
    return true;
};

const avoidCollisions = (players: Player[]) => {
    for (let step = 0.001; step <= 0.1; step += 0.001) {
        for (let i = 0; i < 10; ++i) {
            let collided = false;
            for (let i = 0; i < players.length; ++i) {
                for (let j = 0; j < players.length; ++j) {
                    if (
                        i !== j &&
                        avoidCollision(players[i], players[j], step)
                    ) {
                        collided = true;
                    }
                }
            }
            if (!collided) return;
        }
    }
};

const drawRepeatingBackground = (p5: p5Types, bgImage: p5Types.Image) => {
    p5.imageMode(p5.CORNER);
    for (let y = 0; y < p5.height; y += bgImage.height) {
        for (let x = 0; x < p5.width; x += bgImage.width) {
            p5.image(bgImage, x, y);
        }
    }
};

const BattleGame = ({ numPlayers }: { numPlayers: number }) => {
    if (numPlayers < BATTLE_MIN_PLAYERS || numPlayers > BATTLE_MAX_PLAYERS) {
        throw new Error(
            `numPlayers must be between ${BATTLE_MIN_PLAYERS} and ${BATTLE_MAX_PLAYERS}`,
        );
    }
    const startLives = Math.max(2, Math.ceil(10 / numPlayers));
    const angleIncrement = TAU / numPlayers;
    const ballSpeedStart = 0.0005 + 0.0001 * numPlayers;
    let players = [
        new Player(BATTLE_COLORS[0], 37, 39, 0 * angleIncrement, startLives),
        new Player(BATTLE_COLORS[1], 81, 69, 1 * angleIncrement, startLives),
        new Player(BATTLE_COLORS[2], 73, 80, 2 * angleIncrement, startLives),
        new Player(BATTLE_COLORS[3], 90, 67, 3 * angleIncrement, startLives),
        new Player(BATTLE_COLORS[4], 66, 77, 4 * angleIncrement, startLives),
        new Player(BATTLE_COLORS[5], 70, 72, 5 * angleIncrement, startLives),
    ].slice(0, numPlayers);
    let currentPlayer = getRandomPlayer(numPlayers);
    let arenaSize = 0;
    let ball: Ball;
    let bgImage: p5Types.Image;

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight - NAVBAR_HEIGHT);
        arenaSize = Math.min(
            p5.width - CANVAS_MARGIN,
            p5.height - CANVAS_MARGIN,
            BATTLE_MAX_HEIGHT,
        );
    };

    const preload = (p5: p5Types) => {
        bgImage = p5.loadImage(
            process.env.PUBLIC_URL + '/game-background.webp',
        );
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(0, 0).parent(canvasParentRef);
        windowResized(p5);
        p5.rectMode(p5.CENTER);
        p5.noStroke();
        ball = new Ball(p5, ballSpeedStart);
    };

    const draw = (p5: p5Types) => {
        for (const player of players) {
            player.move(p5);
        }
        avoidCollisions(players);
        ball.move(p5);
        const centerDist = ball.pos.mag();
        if (centerDist >= 1 + BATTLE_BALL_SIZE) {
            --players[currentPlayer].lives;
            if (players[currentPlayer].lives === 0) {
                players = players.filter((_, i) => i !== currentPlayer);
                currentPlayer = getRandomPlayer(players.length);
            } else {
                currentPlayer = getRandomPlayer(players.length, currentPlayer);
            }
            ball = new Ball(p5, ballSpeedStart);
        } else if (
            centerDist >= BATTLE_HIT_PADDLE &&
            centerDist <= 1 - BATTLE_PADDLE_MARGIN - BATTLE_PADDLE_WIDTH / 2
        ) {
            let closestHit: number | null = null;
            for (const player of players) {
                const hit = player.hit(ball.pos);
                if (
                    hit !== null &&
                    (closestHit === null ||
                        Math.abs(hit) < Math.abs(closestHit))
                ) {
                    closestHit = hit;
                }
            }
            if (closestHit !== null) {
                ball.bounce(closestHit);
                currentPlayer = getRandomPlayer(players.length, currentPlayer);
            }
        }
        drawRepeatingBackground(p5, bgImage);
        p5.translate(p5.width / 2, p5.height / 2);
        p5.fill(players[currentPlayer].color);
        p5.circle(0, 0, arenaSize);
        for (const player of players) {
            player.draw(p5, arenaSize);
        }
        if (players.length === 1) {
            gameOver(p5, arenaSize);
        } else {
            ball.draw(p5, arenaSize);
        }
    };

    return (
        <Sketch
            // @ts-ignore
            preload={preload}
            // @ts-ignore
            setup={setup}
            // @ts-ignore
            draw={draw}
            // @ts-ignore
            windowResized={windowResized}
        />
    );
};

const LocalBattleRoyale: React.FC = () => {
    const [params] = useSearchParams();
    const numPlayersString = params.get('numPlayers');
    const numPlayers =
        numPlayersString && /^\d+$/.test(numPlayersString)
            ? clamp(
                  parseInt(numPlayersString),
                  BATTLE_MIN_PLAYERS,
                  BATTLE_MAX_PLAYERS,
              )
            : BATTLE_DEFAULT_PLAYERS;

    return (
        <div
            className="w-full flex items-center justify-center"
            style={{
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            }}
        >
            <BattleGame numPlayers={numPlayers} />
        </div>
    );
};

export default LocalBattleRoyale;
