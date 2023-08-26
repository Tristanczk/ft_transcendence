import React from 'react';
import p5Types from 'p5';
import Sketch from 'react-p5';
import { NAVBAR_HEIGHT } from '../constants';

const TAU = 2 * Math.PI;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;
const MAX_HEIGHT = 720;
const CANVAS_MARGIN = 20;
const BALL_SIZE = 0.03;
const ARC_VERTICES = 12;
const DOT_SHIFT = 0.8;
const BETWEEN_PADDLES = 0.0128;
const PADDLE_MARGIN = 0.05;
const PADDLE_WIDTH = 0.05;
const DEFAULT_PADDLE_SIZE = 0.2;
const HIT_PADDLE = 1 - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
const HIT_ANGLE_FACTOR = Math.PI * 0.3;
const PADDLE_SPEED = 0.005;
const BALL_SPEED_INCREMENT = 0.00007;
const BACKGROUND_COLOR = '#FFFFFF';

class Player {
    private keys: { clockwise: number; antiClockwise: number };
    readonly color: string;
    paddleSize: number;
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
        this.paddleSize = DEFAULT_PADDLE_SIZE;
        this.color = color;
        this.keys = {
            clockwise: keyClockwise,
            antiClockwise: keyAntiClockwise,
        };
    }

    move(p5: p5Types): void {
        const paddleSpeed = PADDLE_SPEED * p5.deltaTime;
        if (p5.keyIsDown(this.keys.clockwise)) {
            this.angle += paddleSpeed;
        }
        if (p5.keyIsDown(this.keys.antiClockwise)) {
            this.angle -= paddleSpeed;
        }
    }

    hit(ballPos: p5Types.Vector): number | null {
        const angleDiff = angleDist(this.angle, ballPos.heading());
        const limit = this.paddleSize + BALL_SIZE / 2;
        return Math.abs(angleDiff) <= limit ? angleDiff / limit : null;
    }

    private drawPaddle(
        p5: p5Types,
        center: number,
        innerDiameter: number,
        outerDiameter: number,
    ): void {
        p5.fill('black');
        p5.beginShape();
        const angles: number[] = Array.from(
            { length: ARC_VERTICES + 1 },
            (_, i) =>
                this.angle + (i / ARC_VERTICES - 0.5) * this.paddleSize * 2,
        );
        for (const angle of angles) {
            p5.vertex(
                center + (p5.cos(angle) * innerDiameter) / 2,
                center + (p5.sin(angle) * innerDiameter) / 2,
            );
        }
        for (const angle of angles.reverse()) {
            p5.vertex(
                center + (p5.cos(angle) * outerDiameter) / 2,
                center + (p5.sin(angle) * outerDiameter) / 2,
            );
        }
        p5.endShape(p5.CLOSE);
    }

    private drawLife(
        p5: p5Types,
        center: number,
        middleRadius: number,
        angle: number,
    ) {
        p5.circle(
            center + p5.cos(angle) * middleRadius,
            center + p5.sin(angle) * middleRadius,
            PADDLE_WIDTH * p5.width * 0.32,
        );
    }

    private drawLives(p5: p5Types, center: number, middleRadius: number): void {
        p5.fill(this.color);
        if (this.lives === 1) {
            this.drawLife(p5, center, middleRadius, this.angle);
            return;
        }
        const startDot = this.angle - DOT_SHIFT * this.paddleSize;
        const angleInc = (2 * DOT_SHIFT * this.paddleSize) / (this.lives - 1);
        for (let i = 0; i < this.lives; ++i) {
            this.drawLife(p5, center, middleRadius, startDot + i * angleInc);
        }
    }

    draw(p5: p5Types): void {
        const center = (p5.width - 1) / 2;
        const innerDiameter = p5.width * (1 - PADDLE_MARGIN - PADDLE_WIDTH);
        const outerDiameter = p5.width * (1 - PADDLE_MARGIN);
        const middleRadius = (innerDiameter + outerDiameter) / 4;
        this.drawPaddle(p5, center, innerDiameter, outerDiameter);
        this.drawLives(p5, center, middleRadius);
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
        this.pos.mult(HIT_PADDLE / this.pos.mag());
        this.vel = this.pos
            .copy()
            .mult(-1)
            .rotate(-hit * HIT_ANGLE_FACTOR)
            .normalize()
            .mult(this.vel.mag() + BALL_SPEED_INCREMENT);
    }

    move(p5: p5Types): void {
        this.pos.add(this.vel.copy().mult(p5.deltaTime));
    }

    draw(p5: p5Types): void {
        p5.fill('black');
        p5.circle(
            (p5.width - 1) / 2 + (this.pos.x * p5.width) / 2,
            (p5.height - 1) / 2 + (this.pos.y * p5.height) / 2,
            BALL_SIZE * p5.width,
        );
    }
}

const trueMod = (x: number, y: number) => {
    let res = x % y;
    return res >= 0 ? res : res + y;
};

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

const gameOver = (p5: p5Types) => {
    p5.textFont('monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(8 + p5.width / 30);
    p5.fill('black');
    const center = (p5.width - 1) / 2;
    p5.text('Game Over!', center, center);
    p5.noLoop();
};

const avoidCollision = (
    player1: Player,
    player2: Player,
    step: number,
): boolean => {
    const angleDiff = angleDist(player1.angle, player2.angle);
    const limit = player1.paddleSize + player2.paddleSize + BETWEEN_PADDLES;
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

const Pong = ({ numPlayers }: { numPlayers: number }) => {
    if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
        throw new Error(
            `numPlayers must be between ${MIN_PLAYERS} and ${MAX_PLAYERS}`,
        );
    }
    const startLives = Math.max(2, Math.ceil(10 / numPlayers));
    const angleIncrement = (Math.PI * 2) / numPlayers;
    const ballSpeedStart = 0.0005 + 0.0001 * numPlayers;
    let players = [
        new Player('#E51654', 37, 39, 0 * angleIncrement, startLives),
        new Player('#16A7E5', 81, 69, 1 * angleIncrement, startLives),
        new Player('#E5D016', 73, 80, 2 * angleIncrement, startLives),
        new Player('#7E16E5', 90, 67, 3 * angleIncrement, startLives),
        new Player('#16E52B', 66, 77, 4 * angleIncrement, startLives),
        new Player('#DDEEFF', 70, 72, 5 * angleIncrement, startLives),
    ].slice(0, numPlayers);
    let currentPlayer = getRandomPlayer(numPlayers);
    let ball: Ball;

    const resize = (p5: p5Types) => {
        const size = Math.min(
            p5.windowWidth - CANVAS_MARGIN,
            p5.windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
            MAX_HEIGHT,
        );
        p5.resizeCanvas(size, size);
    };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(0, 0).parent(canvasParentRef);
        resize(p5);
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
        if (centerDist >= 1 + BALL_SIZE) {
            --players[currentPlayer].lives;
            if (players[currentPlayer].lives === 0) {
                players = players.filter((_, i) => i !== currentPlayer);
                currentPlayer = getRandomPlayer(players.length);
            } else {
                currentPlayer = getRandomPlayer(players.length, currentPlayer);
            }
            ball = new Ball(p5, ballSpeedStart);
        } else if (
            centerDist >= HIT_PADDLE &&
            centerDist <= 1 - PADDLE_MARGIN - PADDLE_WIDTH / 2
        ) {
            for (const player of players) {
                const hit = player.hit(ball.pos);
                if (hit !== null) {
                    ball.bounce(hit);
                    currentPlayer = getRandomPlayer(
                        players.length,
                        currentPlayer,
                    );
                    break;
                }
            }
        }
        p5.background(BACKGROUND_COLOR);
        p5.fill(players[currentPlayer].color);
        p5.circle(p5.width / 2, p5.height / 2, p5.width);
        for (const player of players) {
            player.draw(p5);
        }
        if (players.length === 1) {
            gameOver(p5);
        } else {
            ball.draw(p5);
        }
    };

    // @ts-ignore
    return <Sketch setup={setup} draw={draw} windowResized={resize} />;
};

const BattlePage: React.FC = () => {
    return (
        <div
            className="w-full flex items-center justify-center"
            style={{
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
                background: BACKGROUND_COLOR,
            }}
        >
            <Pong numPlayers={6} />
        </div>
    );
};

export default BattlePage;
