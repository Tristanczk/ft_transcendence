import { useContext, useEffect } from 'react';
import {
    ASPECT_RATIO,
    BALL_HEIGHT,
    BALL_WIDTH,
    LINE_MARGIN,
    LINE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_MARGIN_X,
    PADDLE_WIDTH,
    UNBREAKABLE,
} from '../../shared/classic_mayhem';
import {
    ClassicMayhemGameObjects,
    ClassicMayhemPlayers,
    UpdateGameEvent,
    EloVariation,
} from '../../shared/game_info';
import {
    MayhemCell,
    MayhemMap,
    getMayhemCellPos,
} from '../../shared/mayhem_maps';
import { CANVAS_MARGIN, NAVBAR_HEIGHT, NEARLY_BLACK } from '../../shared/misc';
import { getCanvasCtx } from './getCanvasCtx';
import { WebsocketContext } from '../../context/WebsocketContext';
import { Socket } from 'socket.io-client';
import { clamp } from '../../shared/functions';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import getScoreString from '../getScoreString';

const drawBackground = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.fillStyle = NEARLY_BLACK;
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

const drawNet = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    timeRemaining: number,
) => {
    const opacity = clamp((3000 - timeRemaining) / 3000, 0, 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    const rectSize = BALL_WIDTH * canvas.width;
    const halfRectSize = 0.5 * rectSize;
    const midX = 0.5 * canvas.width - halfRectSize;
    const midY = 0.5 * canvas.height - halfRectSize;
    const limit = (LINE_MARGIN + LINE_WIDTH) * canvas.height - halfRectSize;
    const step = 2 * BALL_WIDTH * canvas.width;
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
    timeRemaining: number,
) => {
    const opacity = clamp((3000 - timeRemaining) / 3000, 0, 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
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
    const ballSize = BALL_WIDTH * canvas.width;
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
    timeRemaining: number,
) => {
    if (mayhemCell.lives > 0) {
        const cellSize = Math.ceil(BALL_WIDTH * ctx.canvas.width);
        const { posX, posY } = getMayhemCellPos(x, y);
        const screenX = Math.round(ctx.canvas.width * (posX - BALL_WIDTH / 2));
        const screenY = Math.round(
            ctx.canvas.height * (posY - BALL_HEIGHT / 2),
        );
        const ratio =
            mayhemCell.lives === UNBREAKABLE ||
            mayhemCell.lives === mayhemCell.startingLives
                ? 1
                : mayhemCell.lives / mayhemCell.startingLives;
        const opacity = clamp((3000 - timeRemaining) / 3000, 0, 1);
        for (let i = 0; i < cellSize; i++) {
            for (let j = 0; j < cellSize; j++) {
                if (ratio === 1 || Math.random() <= ratio) {
                    const pixelIdx =
                        4 * (screenX + i + (screenY + j) * ctx.canvas.width);
                    imageData.data[pixelIdx] = opacity * 255;
                    imageData.data[pixelIdx + 1] = opacity * 255;
                    imageData.data[pixelIdx + 2] = opacity * 255;
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
    timeRemaining: number,
) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    mayhemMap.forEach((row, y) => {
        row.forEach((mayhemCell, x) => {
            drawMayhemCell(ctx, imageData, mayhemCell, x, y, timeRemaining);
        });
    });
    ctx.putImageData(imageData, 0, 0);
};

const drawScore = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    players: ClassicMayhemPlayers,
    timeRemaining: number,
) => {
    const opacity = clamp((3000 - timeRemaining) / 3000, 0, 1);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    const textSize = 8 + canvas.width / 30;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        getScoreString(players[0]?.score ?? 0, players[1]?.score ?? 0),
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
    ctx.fillStyle = NEARLY_BLACK;
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

const drawVersus = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    players: ClassicMayhemPlayers,
    timeRemaining: number,
) => {
    const opacity = (timeRemaining - 3000) / 2000;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    const leftName =
        players[0]!.name.length > 10
            ? players[0]!.name.slice(0, 10) + '...'
            : players[0]!.name;
    const rightName =
        players[1]!.name.length > 10
            ? players[1]!.name.slice(0, 10) + '...'
            : players[1]!.name;
    const textSize = 8 + canvas.width / 20;
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${leftName}`, canvas.width / 4, canvas.height / 4);
    ctx.fillText(
        `${rightName}`,
        (3 * canvas.width) / 4,
        (3 * canvas.height) / 4,
    );
    const versusSize = 8 + canvas.width / 10;
    ctx.font = `${versusSize}px monospace`;
    ctx.fillText(`VS`, canvas.width / 2, canvas.height / 2);
};

const drawEndScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    players: ClassicMayhemPlayers,
    socket: Socket,
    varElo: EloVariation | null,
    isLeftPlayer: boolean,
) => {
    const textSize = 8 + canvas.width / 20;
    let isWinner = false;
    if (
        (isLeftPlayer && players[0]!.score > players[1]!.score) ||
        (!isLeftPlayer && players[0]!.score < players[1]!.score)
    )
        isWinner = true;
    ctx.fillStyle = 'white';
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        isWinner ? 'Victory' : 'Defeat',
        canvas.width / 2,
        canvas.height * 0.3,
    );
    if (varElo) {
        const eloSize = 8 + canvas.width / 40;
        ctx.font = `${eloSize}px monospace`;
        ctx.fillText(
            isLeftPlayer
                ? `Elo: ${players[0]!.elo} -> ${
                      players[0]!.elo + varElo.varEloLeft
                  } (${
                      varElo.varEloLeft > 0
                          ? `+${varElo.varEloLeft}`
                          : varElo.varEloLeft
                  })`
                : `Elo: ${players[1]!.elo} -> ${
                      players[1]!.elo + varElo.varEloRight
                  } (${
                      varElo.varEloRight > 0
                          ? `+${varElo.varEloRight}`
                          : varElo.varEloRight
                  })`,
            canvas.width / 2,
            canvas.height * 0.5,
        );
    }
};

const drawLeaveScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    players: ClassicMayhemPlayers,
    socket: Socket,
    varElo: EloVariation | null,
    gameLeave: UpdateGameEvent,
    isLeftPlayer: boolean,
) => {
    let textSize = 8 + canvas.width / 20;
    ctx.fillStyle = 'white';
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        socket.id === gameLeave.from ? 'Defeat' : 'Victory',
        canvas.width / 2,
        canvas.height * 0.3,
    );
    textSize = 8 + canvas.width / 40;
    ctx.font = `${textSize}px monospace`;
    if (gameLeave.message === 'aborted') {
        ctx.fillText(
            socket.id === gameLeave.from
                ? '(You resigned)'
                : '(Opponent resigned)',
            canvas.width / 2,
            canvas.height * 0.4,
        );
    } else if (gameLeave.message === 'left') {
        ctx.fillText(
            socket.id === gameLeave.from
                ? '(You disconnected)'
                : '(Opponent disconnected)',
            canvas.width / 2,
            canvas.height * 0.4,
        );
    }
    if (varElo) {
        const eloSize = 8 + canvas.width / 40;
        ctx.font = `${eloSize}px monospace`;
        ctx.fillText(
            isLeftPlayer
                ? `Elo: ${players[0]!.elo} -> ${
                      players[0]!.elo + varElo.varEloLeft
                  } (${
                      varElo.varEloLeft > 0
                          ? `+${varElo.varEloLeft}`
                          : varElo.varEloLeft
                  })`
                : `Elo: ${players[1]!.elo} -> ${
                      players[1]!.elo + varElo.varEloRight
                  } (${
                      varElo.varEloRight > 0
                          ? `+${varElo.varEloRight}`
                          : varElo.varEloRight
                  })`,
            canvas.width / 2,
            canvas.height * 0.5,
        );
    }
};

const drawEndButtons = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    navigate: NavigateFunction,
    mode: string,
) => {
    const textSize = 8 + canvas.width / 50;
    const homeButton = {
        width: canvas.width * 0.3,
        height: canvas.height * 0.1,
        x: (canvas.width * 0.7) / 2,
        y: canvas.height * 0.72,
        text: 'Home',
        onClick: () => {
            navigate('/');
        },
    };
    const replayButton = {
        width: canvas.width * 0.3,
        height: canvas.height * 0.1,
        x: (canvas.width * 0.7) / 2,
        y: canvas.height * 0.6,
        text: 'Play again',
        onClick: () => {
            navigate(`/?replay=${mode}`);
        },
    };
    for (const buttonParams of [homeButton, replayButton]) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
            buttonParams.x,
            buttonParams.y,
            buttonParams.width,
            buttonParams.height,
        );
        ctx.fillStyle = 'black';
        ctx.font = `${textSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            buttonParams.text,
            canvas.width / 2,
            buttonParams.y + 0.5 * buttonParams.height,
        );
    }

    canvas.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if (
            (mouseX >= homeButton.x &&
                mouseX <= homeButton.x + homeButton.width &&
                mouseY >= homeButton.y &&
                mouseY <= homeButton.y + homeButton.height) ||
            (mouseX >= replayButton.x &&
                mouseX <= replayButton.x + replayButton.width &&
                mouseY >= replayButton.y &&
                mouseY <= replayButton.y + replayButton.height)
        ) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'auto';
        }
    });

    canvas.addEventListener('click', (event) => {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (
            mouseX >= homeButton.x &&
            mouseX <= homeButton.x + homeButton.width &&
            mouseY >= homeButton.y &&
            mouseY <= homeButton.y + homeButton.height
        ) {
            homeButton.onClick();
        }
        if (
            mouseX >= replayButton.x &&
            mouseX <= replayButton.x + replayButton.width &&
            mouseY >= replayButton.y &&
            mouseY <= replayButton.y + replayButton.height
        ) {
            replayButton.onClick();
        }
    });
};

const MultiClassicMayhem = ({
    gameObjects,
    windowWidth,
    windowHeight,
    mode,
    players,
    isLeftPlayer,
    state,
    timeRemaining,
    varElo,
    gameLeave,
    canvasRef,
}: {
    gameObjects: ClassicMayhemGameObjects;
    windowWidth: number;
    windowHeight: number;
    mode: string;
    players: ClassicMayhemPlayers;
    isLeftPlayer: boolean;
    state: string;
    timeRemaining: number;
    varElo: EloVariation | null;
    gameLeave: UpdateGameEvent | null;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
    const arenaHeight = Math.min(
        (windowWidth - CANVAS_MARGIN) / ASPECT_RATIO,
        windowHeight - NAVBAR_HEIGHT - CANVAS_MARGIN,
    );
    const arenaWidth = arenaHeight * ASPECT_RATIO;
    const socket = useContext(WebsocketContext);
    const navigate = useNavigate();

    useEffect(() => {
        const [canvas, ctx] = getCanvasCtx(
            canvasRef,
            arenaWidth,
            arenaHeight,
            true,
        );
        drawBackground(canvas, ctx);
        drawBar(canvas, ctx, LINE_MARGIN);
        drawBar(canvas, ctx, 1 - LINE_MARGIN - LINE_WIDTH);
        if (players[0] && players[1] && timeRemaining > 3000)
            drawVersus(canvas, ctx, players, timeRemaining);
        else {
            if (players[0])
                drawPaddle(canvas, ctx, true, players[0].pos, timeRemaining);
            if (players[1])
                drawPaddle(canvas, ctx, false, players[1].pos, timeRemaining);
            drawScore(canvas, ctx, players, timeRemaining);
            if (state === 'finished') {
                drawEndScreen(
                    canvas,
                    ctx,
                    players,
                    socket,
                    varElo,
                    isLeftPlayer,
                );
                drawEndButtons(canvas, ctx, navigate, mode);
            } else if (
                gameLeave &&
                (gameLeave.message === 'aborted' ||
                    gameLeave.message === 'left')
            ) {
                drawLeaveScreen(
                    canvas,
                    ctx,
                    players,
                    socket,
                    varElo,
                    gameLeave,
                    isLeftPlayer,
                );
                drawEndButtons(canvas, ctx, navigate, mode);
            } else if (timeRemaining === 0) {
                drawMayhemMap(
                    canvas,
                    ctx,
                    gameObjects.mayhemMap,
                    timeRemaining,
                );
                if (gameObjects.hasNet) drawNet(canvas, ctx, timeRemaining);
                for (const ball of gameObjects.balls) {
                    drawBall(canvas, ctx, ball.posX, ball.posY);
                }
            } else if (players[0] && players[1] && timeRemaining <= 3000) {
                drawMayhemMap(
                    canvas,
                    ctx,
                    gameObjects.mayhemMap,
                    timeRemaining,
                );
                if (gameObjects.hasNet) drawNet(canvas, ctx, timeRemaining);
                drawTimeRemaining(canvas, ctx, timeRemaining);
            } else if (players[0] && players[1])
                drawVersus(canvas, ctx, players, timeRemaining);
        }
    });

    return (
        <canvas
            ref={canvasRef}
            style={{ width: arenaWidth, height: arenaHeight }}
        />
    );
};

export default MultiClassicMayhem;
