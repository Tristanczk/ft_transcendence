import React from 'react';
import type P5 from 'p5';
import Sketch from 'react-p5';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../../constants';
import {
    ASPECT_RATIO,
    BALL_HEIGHT,
    BALL_HIGH,
    BALL_LOW,
    BALL_RADIUS,
    BALL_SPEED_INCREMENT,
    BALL_SPEED_START,
    BALL_WIDTH,
    COLLISION_X,
    COLLISION_Y,
    LINE_MARGIN,
    LINE_WIDTH,
    MAX_Y_FACTOR,
    PADDLE_HEIGHT,
    PADDLE_HIGH,
    PADDLE_LOW,
    PADDLE_MARGIN_X,
    PADDLE_SPEED,
    PADDLE_WIDTH,
} from '../../shared/classic_mayhem';
import {
    MAYHEM_GRID_HALF_HEIGHT,
    MAYHEM_GRID_HALF_WIDTH,
    MayhemCell,
    MayhemMap,
    maps,
} from './mayhem_maps';
import {
    clamp,
    randomChoice,
    randomFloat,
    remap,
} from '../../shared/functions';

type ObstacleCollision = {
    surface: number;
    x: number;
    y: number;
    newPosX: number;
    newPosY: number;
    newVelX: number;
    newVelY: number;
};

const getObstaclePos = (x: number, y: number) => ({
    posX: 0.5 + BALL_WIDTH * (x - MAYHEM_GRID_HALF_WIDTH),
    posY: 0.5 + BALL_HEIGHT * (y - MAYHEM_GRID_HALF_HEIGHT),
});

export class Ball {
    private initialPosY: number;
    posX!: number;
    posY!: number;
    velX!: number;
    velY!: number;

    constructor(initialPosY: number) {
        this.initialPosY = initialPosY;
        this.reset();
    }

    private reset() {
        this.posX = 0.5;
        this.posY = this.initialPosY;
        this.velX = randomChoice([-BALL_SPEED_START, BALL_SPEED_START]);
        this.velY = randomFloat(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START;
    }

    public move(p5: P5) {
        this.posX += this.velX * p5.deltaTime;
        this.posY += this.velY * p5.deltaTime;
    }

    public draw(p5: P5) {
        p5.rectMode(p5.CENTER);
        p5.fill(255);
        p5.square(
            this.posX * p5.width,
            this.posY * p5.height,
            BALL_WIDTH * p5.width,
        );
    }

    public checkScore(scoreLeft: number, scoreRight: number): [number, number] {
        if (this.posX >= 1 + BALL_RADIUS) {
            ++scoreLeft;
            this.reset();
        } else if (this.posX <= -BALL_RADIUS) {
            ++scoreRight;
            this.reset();
        }
        return [scoreLeft, scoreRight];
    }

    public hitBar() {
        if (this.posY <= BALL_LOW || this.posY >= BALL_HIGH) {
            this.posY = clamp(this.posY, BALL_LOW, BALL_HIGH);
            this.velY = -this.velY;
        }
    }

    private hitObstacle(x: number, y: number): ObstacleCollision | null {
        const { posX, posY } = getObstaclePos(x, y);
        const left = posX - BALL_WIDTH;
        const right = posX + BALL_WIDTH;
        const top = posY - BALL_HEIGHT;
        const bottom = posY + BALL_HEIGHT;
        if (
            this.posX <= left ||
            this.posX >= right ||
            this.posY <= top ||
            this.posY >= bottom
        )
            return null;
        const distances = [
            this.velY <= 0
                ? Infinity
                : Math.abs(this.posY - top) / Math.abs(this.velY),
            this.velX >= 0
                ? Infinity
                : Math.abs(this.posX - right) / Math.abs(this.velX),
            this.velY >= 0
                ? Infinity
                : Math.abs(this.posY - bottom) / Math.abs(this.velY),
            this.velX <= 0
                ? Infinity
                : Math.abs(this.posX - left) / Math.abs(this.velX),
        ];
        const collisionSide = distances.indexOf(Math.min(...distances));
        let newPosX = this.posX;
        let newPosY = this.posY;
        let newVelX = this.velX;
        let newVelY = this.velY;
        if (collisionSide === 0) {
            newVelY = -this.velY;
            newPosY = top;
        } else if (collisionSide === 1) {
            newVelX = -this.velX;
            newPosX = right;
        } else if (collisionSide === 2) {
            newVelY = -this.velY;
            newPosY = bottom;
        } else {
            newVelX = -this.velX;
            newPosX = left;
        }
        const surface =
            collisionSide & 1
                ? Math.min(distances[0], distances[2]) / BALL_HEIGHT
                : Math.min(distances[1], distances[3]) / BALL_WIDTH;
        return { surface, x, y, newPosX, newPosY, newVelX, newVelY };
    }

    public hitObstacles = (obstacles: MayhemMap) => {
        let bestCollision: ObstacleCollision | null = null;
        for (let y = 0; y < obstacles.length; ++y) {
            const row = obstacles[y];
            for (let x = 0; x < row.length; ++x) {
                const obstacle = row[x];
                if (obstacle.lives > 0) {
                    const collision = this.hitObstacle(x, y);
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
            this.posX = bestCollision.newPosX;
            this.posY = bestCollision.newPosY;
            this.velX = bestCollision.newVelX;
            this.velY = bestCollision.newVelY;
            --obstacles[bestCollision.y][bestCollision.x].lives;
        }
    };

    private hitPaddle(left: boolean, paddle: number): number | null {
        const x = left ? this.posX : 1 - this.posX;
        if (PADDLE_MARGIN_X <= x && x <= COLLISION_X) {
            const paddleDiff = this.posY - paddle;
            if (Math.abs(paddleDiff) <= COLLISION_Y) {
                return (
                    remap(paddleDiff, 0, COLLISION_Y, 0, MAX_Y_FACTOR) *
                    Math.abs(this.velX)
                );
            }
        }
        return null;
    }

    public hitPaddles(paddleLeft: number, paddleRight: number) {
        const newVelY =
            this.hitPaddle(true, paddleLeft) ||
            this.hitPaddle(false, paddleRight);
        if (newVelY !== null) {
            this.velX = -(
                this.velX +
                Math.sign(this.velX) * BALL_SPEED_INCREMENT
            );
            this.velY = newVelY;
            this.posX = clamp(this.posX, COLLISION_X, 1 - COLLISION_X);
        }
    }
}

const drawPaddle = (p5: P5, left: boolean, y: number) => {
    p5.rectMode(p5.CENTER);
    p5.fill(255);
    const paddleMargin = (PADDLE_MARGIN_X + PADDLE_WIDTH / 2) * p5.width;
    p5.rect(
        left ? paddleMargin : p5.width - paddleMargin,
        y * p5.height,
        PADDLE_WIDTH * p5.width,
        PADDLE_HEIGHT * p5.height,
    );
};

const drawBar = (p5: P5, y: number) => {
    p5.rectMode(p5.CORNER);
    p5.fill(255);
    p5.rect(
        PADDLE_MARGIN_X * p5.width,
        y * p5.height,
        (1 - 2 * PADDLE_MARGIN_X) * p5.width,
        LINE_WIDTH * p5.height,
    );
};

const drawNet = (p5: P5) => {
    p5.rectMode(p5.CENTER);
    p5.fill(255);
    const midX = 0.5 * p5.width;
    const midY = 0.5 * p5.height;
    for (
        let y = midY;
        y >= (LINE_MARGIN + LINE_WIDTH) * p5.height;
        y -= 2 * BALL_WIDTH * p5.width
    ) {
        p5.square(midX, y, BALL_WIDTH * p5.width);
        p5.square(midX, p5.height - y, BALL_WIDTH * p5.width);
    }
};

const drawObstacle = (p5: P5, obstacle: MayhemCell, x: number, y: number) => {
    if (obstacle.lives > 0) {
        const obstacleSize = Math.ceil(BALL_WIDTH * p5.width);
        const { posX, posY } = getObstaclePos(x, y);
        const screenX = Math.round(p5.width * (posX - BALL_WIDTH / 2));
        const screenY = Math.round(p5.height * (posY - BALL_HEIGHT / 2));
        const ratio =
            obstacle.lives === Infinity ||
            obstacle.lives === obstacle.startingLives
                ? 1
                : obstacle.lives / obstacle.startingLives;
        for (let i = 0; i < obstacleSize; i++) {
            for (let j = 0; j < obstacleSize; j++) {
                if (ratio === 1 || Math.random() <= ratio) {
                    const pixelIdx =
                        4 * (screenX + i + (screenY + j) * p5.width);
                    p5.pixels[pixelIdx] = 255;
                    p5.pixels[pixelIdx + 1] = 255;
                    p5.pixels[pixelIdx + 2] = 255;
                }
            }
        }
    }
};

const drawObstacles = (p5: P5, obstacles: MayhemMap) => {
    p5.loadPixels();
    obstacles.forEach((row, y) => {
        row.forEach((obstacle, x) => {
            drawObstacle(p5, obstacle, x, y);
        });
    });
    p5.updatePixels();
};

const drawScore = (p5: P5, scoreLeft: number, scoreRight: number) => {
    p5.fill(255);
    const textSize = 8 + p5.width / 30;
    p5.textSize(textSize);
    p5.textFont('monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(`${scoreLeft} - ${scoreRight}`, p5.width / 2, textSize * 1.25);
};

const movePaddle = (p5: P5, paddle: number, downKey: number, upKey: number) => {
    const paddleSpeed = PADDLE_SPEED * p5.deltaTime;
    if (p5.keyIsDown(downKey)) {
        paddle += paddleSpeed;
    }
    if (p5.keyIsDown(upKey)) {
        paddle -= paddleSpeed;
    }
    return p5.constrain(paddle, PADDLE_LOW, PADDLE_HIGH);
};

const ClassicMayhemGame = ({
    obstacles,
    balls,
    hasNet,
}: {
    obstacles: MayhemMap;
    balls: Ball[];
    hasNet: boolean;
}) => {
    let scoreLeft = 0;
    let scoreRight = 0;

    let paddleLeft = 0.5;
    let paddleRight = 0.5;

    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(0, 0).parent(canvasParentRef);
        windowResized(p5);
        p5.noStroke();
    };

    const draw = (p5: P5) => {
        paddleLeft = movePaddle(p5, paddleLeft, 83, 87);
        paddleRight = movePaddle(p5, paddleRight, p5.DOWN_ARROW, p5.UP_ARROW);

        for (const ball of balls) {
            ball.move(p5);
            ball.hitBar();
            [scoreLeft, scoreRight] = ball.checkScore(scoreLeft, scoreRight);
            ball.hitPaddles(paddleLeft, paddleRight);
            ball.hitObstacles(obstacles);
        }

        p5.background(15);
        drawBar(p5, LINE_MARGIN);
        drawBar(p5, 1 - LINE_MARGIN - LINE_WIDTH);
        drawPaddle(p5, true, paddleLeft);
        drawPaddle(p5, false, paddleRight);
        drawObstacles(p5, obstacles);
        for (const ball of balls) ball.draw(p5);
        if (drawNet) drawNet(p5);
        drawScore(p5, scoreLeft, scoreRight);
    };

    const windowResized = (p5: P5) => {
        const height = Math.round(
            Math.min(
                (p5.windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
                p5.windowHeight - CANVAS_MARGIN - NAVBAR_HEIGHT,
            ),
        );
        p5.resizeCanvas(Math.round(ASPECT_RATIO * height), height);
    };

    // @ts-ignore: wtf
    return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
};

// TODO synchronize obstacles/mayhemMap

const LocalClassicMayhem = ({
    mayhemMap,
    balls,
    hasNet,
}: {
    mayhemMap: MayhemMap;
    balls: Ball[];
    hasNet: boolean;
}) => (
    <div
        className="w-full flex items-center justify-center"
        style={{
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            backgroundImage: `url(${
                process.env.PUBLIC_URL + '/game-background.webp'
            })`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
            backgroundPosition: 'center',
        }}
    >
        <ClassicMayhemGame
            obstacles={mayhemMap}
            balls={balls}
            hasNet={hasNet}
        />
    </div>
);
export default LocalClassicMayhem;
