import { useEffect, useRef } from 'react';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../constants';
import {
    ASPECT_RATIO,
    BALL_SIZE,
    ClassicGameObjects,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
    Players,
} from '../shared';

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
    ballPosX: number,
    ballPosY: number,
) => {
    const ballSize = BALL_SIZE * canvas.width;
    const halfBallSize = 0.5 * ballSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(
        ballPosX * canvas.width - halfBallSize,
        ballPosY * canvas.height - halfBallSize,
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

const ClassicGame = ({
    gameObjects,
    windowWidth,
    windowHeight,
    players,
}: {
    gameObjects: ClassicGameObjects;
    windowWidth: number;
    windowHeight: number;
    players: Players;
}) => {
    const { ballPosX, ballPosY } = gameObjects;
    const arenaHeight = Math.min(
        (windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );
    const arenaWidth = arenaHeight * ASPECT_RATIO;

    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = arenaWidth;
        canvas.height = arenaHeight;
        canvas.style.width = `${arenaWidth}px`;
        canvas.style.height = `${arenaHeight}px`;

        drawBackground(canvas, ctx);
        drawBar(canvas, ctx, LINE_MARGIN);
        drawBar(canvas, ctx, 1 - LINE_MARGIN - LINE_WIDTH);
        drawNet(canvas, ctx);
        if (players[0]) drawPaddle(canvas, ctx, true, players[0].pos);
        if (players[1]) drawPaddle(canvas, ctx, false, players[1].pos);
        drawBall(canvas, ctx, ballPosX, ballPosY);
        drawScore(canvas, ctx, players);
    });

    return (
        <canvas ref={ref} style={{ width: arenaWidth, height: arenaHeight }} />
    );
};

export default ClassicGame;
