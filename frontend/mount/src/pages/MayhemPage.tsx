import React from 'react';
import type P5 from 'p5';
import Sketch from 'react-p5';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../constants';
import {
    ASPECT_RATIO,
    BALL_HIGH,
    BALL_LOW,
    BALL_RADIUS,
    BALL_SIZE,
    BALL_SPEED_INCREMENT,
    BALL_SPEED_START,
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

type Obstacle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Obstacles = Obstacle[];

const map1: Obstacles = [
    { x: 0.15, y: 0.15, width: 0.1, height: 0.1 },
    { x: 0.15, y: 0.85, width: 0.1, height: 0.1 },
    { x: 0.85, y: 0.15, width: 0.1, height: 0.1 },
    { x: 0.85, y: 0.85, width: 0.1, height: 0.1 },
];

const maps = [map1];

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

const drawNet = (p5: P5) => {
    p5.rectMode(p5.CENTER);
    p5.fill(255);
    const midX = 0.5 * p5.width;
    const midY = 0.5 * p5.height;
    for (
        let y = midY;
        y >= (LINE_MARGIN + LINE_WIDTH) * p5.height;
        y -= 2 * BALL_SIZE * p5.width
    ) {
        p5.square(midX, y, BALL_SIZE * p5.width);
        p5.square(midX, p5.height - y, BALL_SIZE * p5.width);
    }
};

const drawBall = (p5: P5, ballPos: P5.Vector) => {
    p5.rectMode(p5.CENTER);
    p5.square(
        ballPos.x * p5.width,
        ballPos.y * p5.height,
        BALL_SIZE * p5.width,
    );
    p5.point(p5.width * ballPos.x, p5.height * ballPos.y);
};

const drawObstacle = (p5: P5, obstacle: Obstacle) => {
    p5.rectMode(p5.CENTER);
    p5.fill(255);
    p5.rect(
        obstacle.x * p5.width,
        obstacle.y * p5.height,
        obstacle.width * p5.width,
        obstacle.height * p5.height,
    );
};

const drawObstacles = (p5: P5, obstacles: Obstacle[]) => {
    for (const obstacle of obstacles) drawObstacle(p5, obstacle);
};

const drawScore = (p5: P5, scoreLeft: number, scoreRight: number) => {
    p5.fill(255);
    const textSize = 8 + p5.width / 30;
    p5.textSize(textSize);
    p5.textFont('monospace');
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(`${scoreLeft}   ${scoreRight}`, p5.width / 2, textSize * 1.25);
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

const hitObstacle = (
    p5: P5,
    ballPos: P5.Vector,
    ballVel: P5.Vector,
    obstacle: Obstacle,
) => {
    const left = obstacle.x - (obstacle.width + BALL_SIZE) / 2;
    const right = obstacle.x + (obstacle.width + BALL_SIZE) / 2;
    const top = obstacle.y - (obstacle.height + BALL_SIZE) / 2;
    const bottom = obstacle.y + (obstacle.height + BALL_SIZE) / 2;

    if (
        ballPos.x >= left &&
        ballPos.x <= right &&
        ballPos.y >= top &&
        ballPos.y <= bottom
    ) {
        const distances = [
            ballVel.x > 0 ? (ballPos.x - left) / ballVel.x : Infinity,
            ballVel.x < 0 ? (ballPos.x - right) / ballVel.x : Infinity,
            ballVel.y > 0 ? (ballPos.y - top) / ballVel.y : Infinity,
            ballVel.y < 0 ? (ballPos.y - bottom) / ballVel.y : Infinity,
        ];

        const collisionSide = distances.indexOf(Math.min(...distances));

        if (collisionSide === 0) {
            ballVel.x = -ballVel.x;
            ballPos.x = left - BALL_SIZE / 2;
        } else if (collisionSide === 1) {
            ballVel.x = -ballVel.x;
            ballPos.x = right + BALL_SIZE / 2;
        } else if (collisionSide === 2) {
            ballVel.y = -ballVel.y;
            ballPos.y = top - BALL_SIZE / 2;
        } else {
            ballVel.y = -ballVel.y;
            ballPos.y = bottom + BALL_SIZE / 2;
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

    let obstacles: Obstacles;

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

        for (const obstacle of obstacles) {
            hitObstacle(p5, ballPos, ballVel, obstacle);
        }

        p5.background(15);
        drawBar(p5, LINE_MARGIN);
        drawBar(p5, 1 - LINE_MARGIN - LINE_WIDTH);
        drawNet(p5);
        drawPaddle(p5, true, paddleLeft);
        drawPaddle(p5, false, paddleRight);
        drawBall(p5, ballPos);
        drawObstacles(p5, obstacles);
        drawScore(p5, scoreLeft, scoreRight);
    };

    const windowResized = (p5: P5) => {
        const height = Math.min(
            (p5.windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
            p5.windowHeight - CANVAS_MARGIN - NAVBAR_HEIGHT,
        );
        p5.resizeCanvas(ASPECT_RATIO * height, height);
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
