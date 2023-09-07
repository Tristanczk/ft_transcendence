import { useEffect, useRef } from 'react';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../constants';
import { BattleGameObjects, Players } from '../shared';

const drawBackground = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.fillStyle = '#0f0f0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawText = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    const textSize = 8 + canvas.width / 30;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMING SOON', canvas.width / 2, canvas.height / 2);
};

const BattleGame = ({
    gameObjects,
    windowWidth,
    windowHeight,
    players,
}: {
    gameObjects: BattleGameObjects;
    windowWidth: number;
    windowHeight: number;
    players: Players;
}) => {
    const arenaHeight = Math.min(
        windowWidth - CANVAS_MARGIN,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );
    const arenaWidth = arenaHeight;

    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = arenaWidth;
        canvas.height = arenaHeight;
        canvas.style.width = `${arenaWidth}px`;
        canvas.style.height = `${arenaHeight}px`;

        drawBackground(canvas, ctx);
        drawText(canvas, ctx);
    });

    return (
        <canvas ref={ref} style={{ width: arenaWidth, height: arenaHeight }} />
    );
};

export default BattleGame;
