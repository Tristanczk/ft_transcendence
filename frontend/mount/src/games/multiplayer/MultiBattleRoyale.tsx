import { useEffect, useRef } from 'react';
import {
    BattleGameObjects,
    BattlePlayer,
    BattlePlayers,
} from '../../shared/game_info';
import { CANVAS_MARGIN, NAVBAR_HEIGHT, NEARLY_BLACK } from '../../shared/misc';
import { getCanvasCtx } from './getCanvasCtx';
import {
    BATTLE_ARC_VERTICES,
    BATTLE_DEFAULT_PADDLE_SIZE,
    BATTLE_MAX_HEIGHT,
    BATTLE_PADDLE_MARGIN,
    BATTLE_PADDLE_WIDTH,
} from '../../shared/battle';

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

const drawPaddle = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    angle: number,
    innerRadius: number,
    outerRadius: number,
) => {
    ctx.fillStyle = NEARLY_BLACK;

    const angles: number[] = Array.from(
        { length: BATTLE_ARC_VERTICES + 1 },
        (_, i) =>
            angle +
            (i / BATTLE_ARC_VERTICES - 0.5) * BATTLE_DEFAULT_PADDLE_SIZE * 2,
    );

    ctx.beginPath();
    for (const angle of angles) {
        const x = Math.cos(angle) * innerRadius + canvas.width / 2;
        const y = Math.sin(angle) * innerRadius + canvas.height / 2;
        ctx.lineTo(x, y);
    }

    for (const angle of angles.reverse()) {
        const x = Math.cos(angle) * outerRadius + canvas.width / 2;
        const y = Math.sin(angle) * outerRadius + canvas.height / 2;
        ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fill();
};

const drawPlayer = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    player: BattlePlayer,
    arenaSize: number,
) => {
    const innerRadius =
        (arenaSize * (1 - BATTLE_PADDLE_MARGIN - BATTLE_PADDLE_WIDTH)) / 2;
    const outerRadius = (arenaSize * (1 - BATTLE_PADDLE_MARGIN)) / 2;
    const middleRadius = (innerRadius + outerRadius) / 2;
    drawPaddle(canvas, ctx, player.angle, innerRadius, outerRadius);
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
        BATTLE_MAX_HEIGHT,
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
        for (const player of players) {
            if (player) {
                drawPlayer(canvas, ctx, player, arenaSize);
            }
        }
        drawText(canvas, ctx);
    });

    console.log('wtf', arenaSize);

    return <canvas ref={ref} style={{ width: arenaSize, height: arenaSize }} />;
};

export default MultiBattleRoyale;
