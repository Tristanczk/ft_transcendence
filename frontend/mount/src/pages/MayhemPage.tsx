import React from 'react';
import type P5 from 'p5';
import Sketch from 'react-p5';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../constants';
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
} from '../shared/classic_mayhem';
import {
    MAYHEM_GRID_HALF_HEIGHT,
    MAYHEM_GRID_HALF_WIDTH,
    MayhemCell,
    MayhemMap,
    maps,
} from '../mayhem_maps';
import { randomChoice, randomFloat } from '../shared/functions';

class Ball {
    posX: number;
    posY: number;
    velX: number;
    velY: number;

    constructor() {
        this.posX = 0.5;
        this.posY = 0.5;
        this.velX = randomChoice([-BALL_SPEED_START, BALL_SPEED_START]);
        this.velY = randomFloat(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START;
    }

    draw(p5: P5) {
        p5.rectMode(p5.CENTER);
        p5.fill(225, 29, 72);
        p5.square(
            this.posX * p5.width,
            this.posY * p5.height,
            BALL_WIDTH * p5.width,
        );
    }
}

const getObstaclePos = (x: number, y: number) => ({
    posX: 0.5 + BALL_WIDTH * (x - MAYHEM_GRID_HALF_WIDTH),
    posY: 0.5 + BALL_HEIGHT * (y - MAYHEM_GRID_HALF_HEIGHT),
});

const drawPaddle = (p5: P5, left: boolean, y: number) => {
    p5.rectMode(p5.CENTER);
    p5.fill(225, 29, 72);
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
    p5.fill(225, 29, 72);
    p5.rect(
        PADDLE_MARGIN_X * p5.width,
        y * p5.height,
        (1 - 2 * PADDLE_MARGIN_X) * p5.width,
        LINE_WIDTH * p5.height,
    );
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
                    p5.pixels[pixelIdx] = 225;
                    p5.pixels[pixelIdx + 1] = 29;
                    p5.pixels[pixelIdx + 2] = 72;
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
    p5.fill(225, 29, 72);
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

const hitPaddle = (
    p5: P5,
    left: boolean,
    paddle: number,
    ball: Ball,
): number | null => {
    const x = left ? ball.posX : 1 - ball.posX;
    if (PADDLE_MARGIN_X <= x && x <= COLLISION_X) {
        const paddleDiff = ball.posY - paddle;
        if (Math.abs(paddleDiff) <= COLLISION_Y) {
            return (
                p5.map(paddleDiff, 0, COLLISION_Y, 0, MAX_Y_FACTOR) *
                Math.abs(ball.velX)
            );
        }
    }
    return null;
};

const hitPaddles = (
    p5: P5,
    paddleLeft: number,
    paddleRight: number,
    ball: Ball,
) => {
    const newVelY =
        hitPaddle(p5, true, paddleLeft, ball) ||
        hitPaddle(p5, false, paddleRight, ball);
    if (newVelY !== null) {
        ball.velX = -(ball.velX + Math.sign(ball.velX) * BALL_SPEED_INCREMENT);
        ball.velY = newVelY;
        ball.posX = p5.constrain(ball.posX, COLLISION_X, 1 - COLLISION_X);
    }
};

type ObstacleCollision = {
    surface: number;
    x: number;
    y: number;
    newPosX: number;
    newPosY: number;
    newVelX: number;
    newVelY: number;
};

const hitObstacle = (
    x: number,
    y: number,
    ball: Ball,
): ObstacleCollision | null => {
    const { posX, posY } = getObstaclePos(x, y);
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
    return { surface, x, y, newPosX, newPosY, newVelX, newVelY };
};

const hitObstacles = (ball: Ball, obstacles: MayhemMap) => {
    let bestCollision: ObstacleCollision | null = null;
    for (let y = 0; y < obstacles.length; ++y) {
        const row = obstacles[y];
        for (let x = 0; x < row.length; ++x) {
            const obstacle = row[x];
            if (obstacle.lives > 0) {
                const collision = hitObstacle(x, y, ball);
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
        --obstacles[bestCollision.y][bestCollision.x].lives;
    }
};

const MayhemGame = () => {
    let scoreLeft = 0;
    let scoreRight = 0;

    let paddleLeft = 0.5;
    let paddleRight = 0.5;

    const obstacles = randomChoice(maps);
    const balls = [new Ball()];

    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(0, 0).parent(canvasParentRef);
        windowResized(p5);
        p5.noStroke();
    };

    const draw = (p5: P5) => {
        paddleLeft = movePaddle(p5, paddleLeft, 83, 87);
        paddleRight = movePaddle(p5, paddleRight, p5.DOWN_ARROW, p5.UP_ARROW);
        balls[0].posX += balls[0].velX * p5.deltaTime;
        balls[0].posY += balls[0].velY * p5.deltaTime;

        if (balls[0].posY <= BALL_LOW || balls[0].posY >= BALL_HIGH) {
            balls[0].posY = p5.constrain(balls[0].posY, BALL_LOW, BALL_HIGH);
            balls[0].velY = -balls[0].velY;
        }
        if (balls[0].posX >= 1 + BALL_RADIUS) {
            ++scoreLeft;
            balls[0] = new Ball();
        } else if (balls[0].posX <= -BALL_RADIUS) {
            ++scoreRight;
            balls[0] = new Ball();
        }

        hitPaddles(p5, paddleLeft, paddleRight, balls[0]);
        hitObstacles(balls[0], obstacles);

        p5.background(15);
        drawBar(p5, LINE_MARGIN);
        drawBar(p5, 1 - LINE_MARGIN - LINE_WIDTH);
        drawPaddle(p5, true, paddleLeft);
        drawPaddle(p5, false, paddleRight);
        drawObstacles(p5, obstacles);
        balls[0].draw(p5);
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

const MayhemPage: React.FC = () => (
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
        <MayhemGame />
    </div>
);
export default MayhemPage;
