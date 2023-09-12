import { useEffect, useRef } from 'react';
import { BattleGameObjects, BattlePlayers } from '../../shared/game_info';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../../shared/misc';

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

const MultiBattleRoyale = ({
    gameObjects,
    windowWidth,
    windowHeight,
    players,
}: {
    gameObjects: BattleGameObjects;
    windowWidth: number;
    windowHeight: number;
    players: BattlePlayers;
}) => {
    console.log(gameObjects);
    const arenaSize = Math.min(
        windowWidth - CANVAS_MARGIN,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );

    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = arenaSize;
        canvas.height = arenaSize;
        canvas.style.width = `${arenaSize}px`;
        canvas.style.height = `${arenaSize}px`;

        drawBackground(canvas, ctx);
        drawText(canvas, ctx);
    });

    return <canvas ref={ref} style={{ width: arenaSize, height: arenaSize }} />;
};

export default MultiBattleRoyale;
