import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { useWindowSize } from 'usehooks-ts';
import { GameInfo, UpdateGameEvent, eloVariation } from '../shared/game_info';
import {
    ApiResult,
    KeyEventType,
    NAVBAR_HEIGHT,
    PLAYERS_TEXT_SIZE,
} from '../shared/misc';
import MultiClassicMayhem from '../games/multiplayer/MultiClassicMayhem';
import MultiBattleRoyale from '../games/multiplayer/MultiBattleRoyale';

const Game = ({
    gameInfo,
    varElo,
    width,
    height,
}: {
    gameInfo: GameInfo;
    varElo: eloVariation | null;
    width: number;
    height: number;
}) => {
    let leftName: string = '',
        rightName: string = '';
    if (gameInfo.mode !== 'battle') {
        leftName =
            gameInfo.players[0]!.name.length > 10
                ? gameInfo.players[0]!.name.slice(0, 10) + '...'
                : gameInfo.players[0]!.name;
        rightName =
            gameInfo.players[1]!.name.length > 10
                ? gameInfo.players[1]!.name.slice(0, 10) + '...'
                : gameInfo.players[1]!.name;
    }
    return gameInfo.mode === 'battle' ? (
        <MultiBattleRoyale
            gameObjects={gameInfo.objects}
            players={gameInfo.players}
            windowWidth={width}
            windowHeight={height}
        />
    ) : (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full">
                <div className="text-black">
                    {leftName} (
                    {varElo
                        ? gameInfo.players[0]!.elo + varElo.varEloLeft
                        : gameInfo.players[0]!.elo}
                    {varElo && (
                        <span
                            className={
                                varElo.varEloLeft > 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }
                        >
                            {' '}
                            {varElo!.varEloLeft > 0
                                ? `+${varElo!.varEloLeft}`
                                : varElo!.varEloLeft}
                        </span>
                    )}
                    )
                </div>
                <div className="text-black">
                    {rightName} (
                    {varElo
                        ? gameInfo.players[1]!.elo + varElo.varEloRight
                        : gameInfo.players[1]!.elo}
                    {varElo && (
                        <span
                            className={
                                varElo.varEloRight > 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }
                        >
                            {' '}
                            {varElo!.varEloRight > 0
                                ? `+${varElo!.varEloRight}`
                                : varElo!.varEloRight}
                        </span>
                    )}
                    )
                </div>
            </div>
            <MultiClassicMayhem
                gameObjects={gameInfo.objects}
                mode={gameInfo.mode}
                players={gameInfo.players}
                state={gameInfo.state}
                timeRemaining={gameInfo.timeRemaining}
                varElo={varElo}
                windowWidth={width}
                windowHeight={height}
            />
        </div>
    );
};

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const socket = useContext(WebsocketContext);
    const { width, height } = useWindowSize();
    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
    const [message, setMessage] = useState<string>('');
    const [varElo, setVarElo] = useState<eloVariation | null>(null);

    useEffect(() => {
        const handleUpdateGameInfo = (newGameInfo: GameInfo) => {
            setGameInfo(newGameInfo);
        };

        const handleEventGame = (eventGameInfo: UpdateGameEvent) => {
            console.log(eventGameInfo);
        };

        socket.on('updateGameInfo', handleUpdateGameInfo);

        socket.on('eventGame', handleEventGame);

        return () => {
            socket.off('updateGameInfo', handleUpdateGameInfo);
        };
    }, [socket]);

    useEffect(() => {
        return () => {
            console.log('leaving', gameId);
        };
    }, [gameId]);

    // TODO handle page left (keyup for all keys) (not a spectator anymore)

    useEffect(() => {
        const emitKeyEvent = (event: KeyboardEvent, type: KeyEventType) => {
            if (gameId && !event.repeat) {
                socket.emit('keyEvent', { key: event.key, type, gameId });
            }
        };

        const handleKeyDown = (event: KeyboardEvent) =>
            emitKeyEvent(event, 'down');
        const handleKeyUp = (event: KeyboardEvent) => emitKeyEvent(event, 'up');

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        document.addEventListener('keydown', function (event) {
            if (event.key === 'q' || event.key === 'Q') {
                // La touche "Q" a été appuyée
                socket.emit('quitGame', gameId);
            }
        });

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [socket, gameId]);

    useEffect(() => {
        socket.emit('getGameInfo', gameId, (response: ApiResult<GameInfo>) => {
            if (response.success) {
                setGameInfo(response.data);
            } else {
                console.error(response.error);
                navigate('/404');
            }
        });
    }, [gameId, navigate, socket]);

    useEffect(() => {
        socket.on('eventGame', (data: UpdateGameEvent) => {
            setMessage(data.message);
        });

        return () => {
            socket.off('eventGame');
        };
    });

    useEffect(() => {
        socket.on('varElo', (data: eloVariation) => {
            setVarElo(data);
        });
    });

    return (
        <div
            className="w-full flex items-center justify-center"
            style={{
                height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
                backgroundImage: `url(${
                    process.env.PUBLIC_URL + '/game-background.webp'
                })`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
                backgroundPosition: 'center',
            }}
        >
            {gameInfo && (
                <Game
                    gameInfo={gameInfo}
                    varElo={varElo}
                    width={width}
                    height={height - PLAYERS_TEXT_SIZE}
                />
            )}
        </div>
    );
};

export default GamePage;
