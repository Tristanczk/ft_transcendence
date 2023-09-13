import { useEffect, useRef } from 'react';
import {
    BattleGameObjects,
    BattlePlayer,
    BattlePlayers,
} from '../../shared/game_info';
import {
    CANVAS_MARGIN,
    NAVBAR_HEIGHT,
    NEARLY_BLACK,
    TAU,
} from '../../shared/misc';
import { getCanvasCtx } from './getCanvasCtx';
import {
    BATTLE_ARC_VERTICES,
    BATTLE_DEFAULT_PADDLE_SIZE,
    BATTLE_DOT_RADIUS,
    BATTLE_DOT_SHIFT,
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
    ctx.arc(centerX, centerY, radius, 0, TAU);
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

const drawLife = (
    ctx: CanvasRenderingContext2D,
    middleRadius: number,
    angle: number,
    arenaSize: number,
    color: string,
) => {
    ctx.fillStyle = color;

    const x = Math.cos(angle) * middleRadius + ctx.canvas.width / 2;
    const y = Math.sin(angle) * middleRadius + ctx.canvas.height / 2;
    const radius = BATTLE_PADDLE_WIDTH * arenaSize * BATTLE_DOT_RADIUS * 0.5;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
};

const drawLives = (
    ctx: CanvasRenderingContext2D,
    middleRadius: number,
    arenaSize: number,
    player: BattlePlayer,
) => {
    if (player.lives === 1) {
        drawLife(ctx, middleRadius, player.angle, arenaSize, player.color);
    } else {
        const startDot =
            player.angle - BATTLE_DOT_SHIFT * BATTLE_DEFAULT_PADDLE_SIZE;
        const angleInc =
            (2 * BATTLE_DOT_SHIFT * BATTLE_DEFAULT_PADDLE_SIZE) /
            (player.lives - 1);

        for (let i = 0; i < player.lives; ++i) {
            drawLife(
                ctx,
                middleRadius,
                startDot + i * angleInc,
                arenaSize,
                player.color,
            );
        }
    }
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
    drawLives(ctx, middleRadius, arenaSize, player);
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
            players[gameObjects.currentPlayer]?.color ?? '#50C878', // TODO no default, what to do while not srarted?
        );
        for (const player of players) {
            if (player) drawPlayer(canvas, ctx, player, arenaSize);
        }
        drawText(canvas, ctx);
    });

    return <canvas ref={ref} style={{ width: arenaSize, height: arenaSize }} />;
};

export default MultiBattleRoyale;
