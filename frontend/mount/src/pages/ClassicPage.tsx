import React from 'react';
import type P5 from 'p5';
import Sketch from 'react-p5';
import { NAVBAR_HEIGHT } from '../constants';

const ASPECT_RATIO = 16 / 9;
const CANVAS_MARGIN = 20;
const BALL_SIZE = 0.02;

const PADDLE_MARGIN_X = 0.01;
const PADDLE_MARGIN_Y = PADDLE_MARGIN_X * ASPECT_RATIO;
const PADDLE_WIDTH = 0.015;
const PADDLE_HEIGHT = 0.16;
const PADDLE_SPEED = 0.001;

const BALL_SPEED_START = 0.0005;
const BALL_SPEED_INCREMENT = 0.00005;
const MAX_Y_FACTOR = 2.0;

const LOW = BALL_SIZE / 2;
const HIGH = 1 - BALL_SIZE / 2;
const BALL_RADIUS = BALL_SIZE / 2;
const COLLISION_X = PADDLE_MARGIN_X + PADDLE_WIDTH + BALL_RADIUS;
const COLLISION_Y = PADDLE_HEIGHT / 2 + BALL_RADIUS;

const ClassicGame = () => {
    let scoreLeft = 0;
    let scoreRight = 0;

    let paddleLeft = 0.5;
    let paddleRight = 0.5;

    let ballPos: P5.Vector;
    let ballVel: P5.Vector;

    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(
            canvasParentRef,
        );
        resize(p5);
        p5.rectMode(p5.CENTER);
        p5.noStroke();
        p5.textFont('monospace');
        p5.textAlign(p5.CENTER, p5.CENTER);
        console.log(p5.width);
        reset(p5);
    };

    const draw = (p5: P5) => {
        paddleLeft = movePaddle(p5, paddleLeft, 83, 87);
        paddleRight = movePaddle(p5, paddleRight, p5.DOWN_ARROW, p5.UP_ARROW);

        ballPos.x += ballVel.x * p5.deltaTime;
        ballPos.y += ballVel.y * p5.deltaTime;

        if (ballPos.y <= LOW || ballPos.y >= HIGH) {
            ballPos.y = p5.constrain(ballPos.y, LOW, HIGH);
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
            hitPaddle(p5, true, paddleLeft, ballPos) ||
            hitPaddle(p5, false, paddleRight, ballPos);
        if (newVelY !== null) {
            ballVel.x = -(
                ballVel.x +
                Math.sign(ballVel.x) * BALL_SPEED_INCREMENT
            );
            ballVel.y = newVelY;
            ballPos.x = p5.constrain(ballPos.x, COLLISION_X, 1 - COLLISION_X);
        }

        p5.background(15);
        drawPaddle(p5, true, paddleLeft);
        drawPaddle(p5, false, paddleRight);
        p5.square(
            ballPos.x * p5.width,
            ballPos.y * p5.height,
            BALL_SIZE * p5.width,
        );

        p5.fill(255);
        p5.text(`${scoreLeft} - ${scoreRight}`, p5.width / 2, 50);
    };

    const windowResized = (p5: P5) => {
        resize(p5);
    };

    const movePaddle = (
        p5: P5,
        paddle: number,
        downKey: number,
        upKey: number,
    ) => {
        const paddleSpeed = PADDLE_SPEED * p5.deltaTime;
        if (p5.keyIsDown(downKey)) {
            paddle += paddleSpeed;
        }
        if (p5.keyIsDown(upKey)) {
            paddle -= paddleSpeed;
        }
        return p5.constrain(
            paddle,
            PADDLE_HEIGHT / 2 + PADDLE_MARGIN_Y,
            1 - PADDLE_HEIGHT / 2 - PADDLE_MARGIN_Y,
        );
    };

    const hitPaddle = (
        p5: P5,
        left: boolean,
        paddle: number,
        ballPos: P5.Vector,
    ): number | null => {
        const x = left ? ballPos.x : 1 - ballPos.x;
        if (PADDLE_MARGIN_X + PADDLE_WIDTH / 2 <= x && x <= COLLISION_X) {
            const paddleDiff = ballPos.y - paddle;
            if (Math.abs(paddleDiff) <= COLLISION_Y) {
                return (
                    p5.map(
                        paddleDiff,
                        -COLLISION_Y,
                        COLLISION_Y,
                        -MAX_Y_FACTOR,
                        MAX_Y_FACTOR,
                    ) * Math.abs(ballVel.x)
                );
            }
        }
        return null;
    };

    const drawPaddle = (p5: P5, left: boolean, y: number) => {
        const paddleMargin = (PADDLE_MARGIN_X + PADDLE_WIDTH / 2) * p5.width;
        p5.rect(
            left ? paddleMargin : p5.width - paddleMargin,
            y * p5.height,
            PADDLE_WIDTH * p5.width,
            PADDLE_HEIGHT * p5.height,
        );
    };

    const resize = (p5: P5) => {
        const height = Math.min(
            (p5.windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
            p5.windowHeight - CANVAS_MARGIN,
        );
        p5.resizeCanvas(ASPECT_RATIO * height, height);
        p5.textSize(8 + p5.width / 30);
        console.log(p5.width, p5.windowWidth, p5.height, p5.windowHeight);
    };

    const reset = (p5: P5) => {
        ballPos = p5.createVector(0.5, 0.5);
        ballVel = p5.createVector(
            p5.random([-BALL_SPEED_START, BALL_SPEED_START]),
            p5.random(-MAX_Y_FACTOR, MAX_Y_FACTOR) * BALL_SPEED_START,
        );
    };

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
};

const ClassicPage: React.FC = () => (
    <div
        className="w-full flex items-center justify-center"
        style={{
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
    >
        <ClassicGame />
    </div>
);

export default ClassicPage;
