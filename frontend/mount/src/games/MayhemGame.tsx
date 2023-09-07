import { useEffect, useRef } from 'react';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../constants';
import { MayhemGameObjects, Players } from '../shared';

const ASPECT_RATIO = 286 / 175;
const BALL_SIZE = 0.018;

const PADDLE_MARGIN_X = 0.01;
const PADDLE_WIDTH = 0.015;
const PADDLE_HEIGHT = 0.16;

const LINE_MARGIN = 0.01;
const LINE_WIDTH = PADDLE_WIDTH;

const drawBackground = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawBar = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    y: number,
) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(
        PADDLE_MARGIN_X * canvas.width,
        y * canvas.height,
        (1 - 2 * PADDLE_MARGIN_X) * canvas.width,
        LINE_WIDTH * canvas.height,
    );
};

// TODO multicolor wave
const drawNet = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    const rectSize = BALL_SIZE * canvas.width;
    const halfRectSize = 0.5 * rectSize;
    const midX = 0.5 * canvas.width - halfRectSize;
    const midY = 0.5 * canvas.height - halfRectSize;
    const limit = (LINE_MARGIN + LINE_WIDTH) * canvas.height - halfRectSize;
    const step = 2 * BALL_SIZE * canvas.width;
    const symmetric = canvas.height + rectSize;
    for (let y = midY; y >= limit; y -= step) {
        ctx.fillRect(midX, y, rectSize, rectSize);
        ctx.fillRect(midX, symmetric - y, rectSize, rectSize);
    }
};

const drawPaddle = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    left: boolean,
    y: number,
) => {
    const paddleMargin = (PADDLE_MARGIN_X + PADDLE_WIDTH / 2) * canvas.width;
    const w = PADDLE_WIDTH * canvas.width;
    const h = PADDLE_HEIGHT * canvas.height;
    ctx.fillRect(
        (left ? paddleMargin : canvas.width - paddleMargin) - w / 2,
        y * canvas.height - h / 2,
        w,
        h,
    );
};

const drawBall = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    ballX: number,
    ballY: number,
) => {
    const ballSize = BALL_SIZE * canvas.width;
    const halfBallSize = 0.5 * ballSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(
        ballX * canvas.width - halfBallSize,
        ballY * canvas.height - halfBallSize,
        ballSize,
        ballSize,
    );
};

const drawScore = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    players: Players,
) => {
    ctx.fillStyle = 'white';
    const textSize = 8 + canvas.width / 30;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `${players[0] ? players[0].score : ' '}   ${
            players[1] ? players[1].score : ' '
        }`,
        canvas.width / 2,
        textSize * 1.25,
    );
};

const MayhemGame = ({
    gameObjects,
    windowWidth,
    windowHeight,
    players,
}: {
    gameObjects: MayhemGameObjects;
    windowWidth: number;
    windowHeight: number;
    players: Players;
}) => {
    const arenaHeight = Math.min(
        (windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );
    const arenaWidth = arenaHeight * ASPECT_RATIO;

    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = arenaWidth;
        canvas.height = arenaHeight;
        canvas.style.width = `${arenaWidth}px`;
        canvas.style.height = `${arenaHeight}px`;

        drawBackground(canvas, ctx);
        drawBar(canvas, ctx, LINE_MARGIN);
        drawBar(canvas, ctx, 1 - LINE_MARGIN - LINE_WIDTH);
        drawNet(canvas, ctx);
        if (players[0] !== null) drawPaddle(canvas, ctx, true, players[0].pos);
        if (players[1] !== null) drawPaddle(canvas, ctx, false, players[1].pos);
        drawBall(canvas, ctx, 0.5, 0.5);
        drawScore(canvas, ctx, players);
    });

    return (
        <canvas ref={ref} style={{ width: arenaWidth, height: arenaHeight }} />
    );
};

export default MayhemGame;
