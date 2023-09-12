import { useEffect, useRef } from 'react';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../../constants';
import {
    ASPECT_RATIO,
    BALL_HEIGHT,
    BALL_SIZE,
    BALL_WIDTH,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
} from '../../shared/classic_mayhem';
import { ClassicMayhemGameObjects, Players } from '../../shared/game_info';
import {
    MayhemCell,
    MayhemMap,
    getMayhemCellPos,
} from '../../shared/mayhem_maps';

const BACKGROUND_COLOR = '#0f0f0f';

const drawBackground = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.fillStyle = BACKGROUND_COLOR;
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

const drawMayhemCell = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData,
    mayhemCell: MayhemCell,
    x: number,
    y: number,
) => {
    if (mayhemCell.lives > 0) {
        const cellSize = Math.ceil(BALL_WIDTH * ctx.canvas.width);
        const { posX, posY } = getMayhemCellPos(x, y);
        const screenX = Math.round(ctx.canvas.width * (posX - BALL_WIDTH / 2));
        const screenY = Math.round(
            ctx.canvas.height * (posY - BALL_HEIGHT / 2),
        );
        const ratio =
            mayhemCell.lives === Infinity ||
            mayhemCell.lives === mayhemCell.startingLives
                ? 1
                : mayhemCell.lives / mayhemCell.startingLives;

        for (let i = 0; i < cellSize; i++) {
            for (let j = 0; j < cellSize; j++) {
                if (ratio === 1 || Math.random() <= ratio) {
                    const pixelIdx =
                        4 * (screenX + i + (screenY + j) * ctx.canvas.width);
                    imageData.data[pixelIdx] = 255;
                    imageData.data[pixelIdx + 1] = 255;
                    imageData.data[pixelIdx + 2] = 255;
                    imageData.data[pixelIdx + 3] = 255;
                }
            }
        }
    }
};

const drawMayhemMap = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    mayhemMap: MayhemMap,
) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    mayhemMap.forEach((row, y) => {
        row.forEach((mayhemCell, x) => {
            drawMayhemCell(ctx, imageData, mayhemCell, x, y);
        });
    });
    ctx.putImageData(imageData, 0, 0);
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

const drawTimeRemaining = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    timeRemaining: number,
) => {
    const borderSize = canvas.width / 200;
    const innerSquareSize = canvas.height * 0.3;
    const outerSquareSize = innerSquareSize + 2 * borderSize;
    ctx.fillStyle = 'white';
    ctx.fillRect(
        (canvas.width - outerSquareSize) / 2,
        (canvas.height - outerSquareSize) / 2,
        outerSquareSize,
        outerSquareSize,
    );
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(
        (canvas.width - innerSquareSize) / 2,
        (canvas.height - innerSquareSize) / 2,
        innerSquareSize,
        innerSquareSize,
    );
    ctx.fillStyle = 'white';
    const textSize = 24 + canvas.width / 10;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `${Math.ceil(timeRemaining / 1000)}`,
        canvas.width / 2,
        canvas.height / 2 + textSize * 0.1,
    );
};

const MultiClassicMayhem = ({
    gameObjects,
    windowWidth,
    windowHeight,
    players,
    timeRemaining,
}: {
    gameObjects: ClassicMayhemGameObjects;
    windowWidth: number;
    windowHeight: number;
    players: Players;
    timeRemaining: number;
}) => {
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
        if (gameObjects.hasNet) drawNet(canvas, ctx);
        if (players[0]) drawPaddle(canvas, ctx, true, players[0].pos);
        if (players[1]) drawPaddle(canvas, ctx, false, players[1].pos);
        drawMayhemMap(canvas, ctx, gameObjects.mayhemMap);
        drawScore(canvas, ctx, players);
        if (timeRemaining === 0) {
            for (const ball of gameObjects.balls) {
                drawBall(canvas, ctx, ball.posX, ball.posY);
            }
        } else if (players[0] && players[1]) {
            drawTimeRemaining(canvas, ctx, timeRemaining);
        }
    });

    return (
        <canvas ref={ref} style={{ width: arenaWidth, height: arenaHeight }} />
    );
};

export default MultiClassicMayhem;
