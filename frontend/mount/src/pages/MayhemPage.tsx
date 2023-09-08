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

const getObstaclePos = (x: number, y: number) => ({
    posX: 0.5 + BALL_WIDTH * (x - MAYHEM_GRID_HALF_WIDTH),
    posY: 0.5 + BALL_HEIGHT * (y - MAYHEM_GRID_HALF_HEIGHT),
});

const drawPaddle = (p5: P5, left: boolean, y: number) => {
    p5.rectMode(p5.CENTER);
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

const drawBall = (p5: P5, ballPos: P5.Vector) => {
    p5.rectMode(p5.CENTER);
    p5.square(
        ballPos.x * p5.width,
        ballPos.y * p5.height,
        BALL_WIDTH * p5.width,
    );
};

const drawObstacle = (p5: P5, obstacle: MayhemCell, x: number, y: number) => {
    if (obstacle.lives > 0) {
        const obstacleSize = Math.ceil(BALL_WIDTH * p5.width);
        const { posX, posY } = getObstaclePos(x, y);
        const screenX = Math.round(p5.width * (posX - BALL_WIDTH / 2));
        const screenY = Math.round(p5.height * (posY - BALL_HEIGHT / 2));
        const ratio =
            obstacle.lives === Infinity
                ? 1
                : obstacle.lives / obstacle.startingLives;
        for (let i = 0; i < obstacleSize; i++) {
            for (let j = 0; j < obstacleSize; j++) {
                if (Math.random() <= ratio) {
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

const hitPaddle = (
    p5: P5,
    left: boolean,
    paddle: number,
    ballPos: P5.Vector,
    ballVel: P5.Vector,
): number | null => {
    const x = left ? ballPos.x : 1 - ballPos.x;
    if (PADDLE_MARGIN_X + PADDLE_WIDTH / 2 <= x && x <= COLLISION_X) {
        const paddleDiff = ballPos.y - paddle;
        if (Math.abs(paddleDiff) <= COLLISION_Y) {
            return (
                p5.map(paddleDiff, 0, COLLISION_Y, 0, MAX_Y_FACTOR) *
                Math.abs(ballVel.x)
            );
        }
    }
    return null;
};

const hitObstacles = (
    ballPos: P5.Vector,
    ballVel: P5.Vector,
    obstacles: MayhemMap,
) => {
    for (let y = 0; y < obstacles.length; ++y) {
        const row = obstacles[y];
        for (let x = 0; x < row.length; ++x) {
            const obstacle = row[x];
            if (obstacle.lives > 0) {
                const { posX, posY } = getObstaclePos(x, y);
                const left = posX - BALL_WIDTH;
                const right = posX + BALL_WIDTH;
                const top = posY - BALL_HEIGHT;
                const bottom = posY + BALL_HEIGHT;

                if (
                    ballPos.x >= left &&
                    ballPos.x <= right &&
                    ballPos.y >= top &&
                    ballPos.y <= bottom
                ) {
                    const distances = [
                        ballVel.x > 0
                            ? (ballPos.x - left) / ballVel.x
                            : Infinity,
                        ballVel.x < 0
                            ? (ballPos.x - right) / ballVel.x
                            : Infinity,
                        ballVel.y > 0
                            ? (ballPos.y - top) / ballVel.y
                            : Infinity,
                        ballVel.y < 0
                            ? (ballPos.y - bottom) / ballVel.y
                            : Infinity,
                    ];

                    const collisionSide = distances.indexOf(
                        Math.min(...distances),
                    );

                    if (collisionSide === 0) {
                        ballVel.x = -ballVel.x;
                        ballPos.x = left - BALL_WIDTH / 2;
                    } else if (collisionSide === 1) {
                        ballVel.x = -ballVel.x;
                        ballPos.x = right + BALL_WIDTH / 2;
                    } else if (collisionSide === 2) {
                        ballVel.y = -ballVel.y;
                        ballPos.y = top - BALL_HEIGHT / 2;
                    } else {
                        ballVel.y = -ballVel.y;
                        ballPos.y = bottom + BALL_HEIGHT / 2;
                    }
                    --obstacles[y][x].lives;
                }
            }
        }
    }
};

const MayhemGame = () => {
    let scoreLeft = 0;
    let scoreRight = 0;

    let paddleLeft = 0.5;
    let paddleRight = 0.5;

    let ballPos: P5.Vector;
    let ballVel: P5.Vector;

    let obstacles: MayhemMap;

    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(0, 0).parent(canvasParentRef);
        windowResized(p5);
        obstacles = maps[Math.floor(Math.random() * maps.length)];
        p5.noStroke();
        reset(p5);
    };

    const draw = (p5: P5) => {
        paddleLeft = movePaddle(p5, paddleLeft, 83, 87);
        paddleRight = movePaddle(p5, paddleRight, p5.DOWN_ARROW, p5.UP_ARROW);
        ballPos.add(ballVel.copy().mult(p5.deltaTime));

        if (ballPos.y <= BALL_LOW || ballPos.y >= BALL_HIGH) {
            ballPos.y = p5.constrain(ballPos.y, BALL_LOW, BALL_HIGH);
            ballVel.y = -ballVel.y;
        }
        if (ballPos.x >= 1 + BALL_RADIUS) {
            ++scoreLeft;
            reset(p5);
        } else if (ballPos.x <= -BALL_RADIUS) {
            ++scoreRight;
            reset(p5);
        }

        const newVelY =
            hitPaddle(p5, true, paddleLeft, ballPos, ballVel) ||
            hitPaddle(p5, false, paddleRight, ballPos, ballVel);
        if (newVelY !== null) {
            ballVel.x = -(
                ballVel.x +
                Math.sign(ballVel.x) * BALL_SPEED_INCREMENT
            );
            ballVel.y = newVelY;
            ballPos.x = p5.constrain(ballPos.x, COLLISION_X, 1 - COLLISION_X);
        }

        hitObstacles(ballPos, ballVel, obstacles);

        p5.background(15);
        drawBar(p5, LINE_MARGIN);
        drawBar(p5, 1 - LINE_MARGIN - LINE_WIDTH);
        drawPaddle(p5, true, paddleLeft);
        drawPaddle(p5, false, paddleRight);
        drawBall(p5, ballPos);
        drawObstacles(p5, obstacles);
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

    const reset = (p5: P5) => {
        ballPos = p5.createVector(0.5, 0.5);
        ballVel = p5.createVector(
            p5.random([-BALL_SPEED_START, BALL_SPEED_START]),
            p5.random(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START,
        );
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
