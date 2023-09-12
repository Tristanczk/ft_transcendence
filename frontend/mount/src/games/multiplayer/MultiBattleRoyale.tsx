import { useEffect, useRef } from 'react';
import { BattleGameObjects, BattlePlayers } from '../../shared/game_info';
import { CANVAS_MARGIN, NAVBAR_HEIGHT } from '../../shared/misc';
import { BATTLE_COLORS } from '../../shared/battle';
import { getCanvasCtx } from './getCanvasCtx';

const drawText = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    const textSize = 8 + canvas.width / 30;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COMING SOON', canvas.width / 2, canvas.height / 2);
};

const drawArena = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    arenaSize: number,
    color: string,
) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = arenaSize / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
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
    console.log(JSON.stringify({ players, gameObjects }));
    const arenaSize = Math.min(
        windowWidth - CANVAS_MARGIN,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );

    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const [canvas, ctx] = getCanvasCtx(ref, arenaSize, arenaSize, false);
        drawArena(
            canvas,
            ctx,
            arenaSize,
            players[gameObjects.currentPlayer]?.color ?? '#50C878',
        );
        drawText(canvas, ctx);
    });

    console.log('wtf', arenaSize);

    return <canvas ref={ref} style={{ width: arenaSize, height: arenaSize }} />;
};

export default MultiBattleRoyale;
