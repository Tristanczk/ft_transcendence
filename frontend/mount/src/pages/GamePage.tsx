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
import { Socket } from 'socket.io-client';
import ResignModal from '../games/multiplayer/ResignModal';
import { useUserContext } from '../context/UserContext';
import { User } from '../types';

const Game = ({
    gameId,
    gameInfo,
    gameLeave,
    socket,
    varElo,
    user,
    width,
    height,
}: {
    gameId: string | undefined;
    gameInfo: GameInfo;
    gameLeave: UpdateGameEvent | null;
    socket: Socket;
    varElo: eloVariation | null;
    user: User | null;
    width: number;
    height: number;
}) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    let leftName: string = '',
        rightName: string = '';
    let isLeftPlayer: boolean = false;

    if (gameInfo.mode !== 'battle') {
        leftName =
            gameInfo.players[0]!.name.length > 10
                ? gameInfo.players[0]!.name.slice(0, 10) + '...'
                : gameInfo.players[0]!.name;
        rightName =
            gameInfo.players[1]!.name.length > 10
                ? gameInfo.players[1]!.name.slice(0, 10) + '...'
                : gameInfo.players[1]!.name;
        if (gameInfo.players[0]!.id === socket.id) {
            isLeftPlayer = true;
        } else if (gameInfo.players[1]!.id !== socket.id) {
            if (user && user.nickname === gameInfo.players[0]!.name) {
                isLeftPlayer = true;
            }
        }
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
            {gameLeave &&
            (gameLeave.message === 'disconnected' ||
                gameLeave.message === 'left') ? (
                <div className="text-red-500">
                    WARNING: your opponent has disconnected, game will terminate
                    in {Math.round(gameLeave.timeLeft! / 1000)} seconds.
                </div>
            ) : (
                <div className="text-red-500 h-6"></div>
            )}
            <div className="flex justify-between w-full mb-1">
                <div className="text-black" style={{ height: '26px' }}>
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
                    {isLeftPlayer &&
                        gameInfo.state !== 'finished' &&
                        gameLeave?.message !== 'aborted' &&
                        gameLeave?.message !== 'left' &&
                        gameInfo.timeRemaining === 0 && (
                            <button
                                className="px-2 ml-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:outline-none rounded-lg"
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                            >
                                Resign
                            </button>
                        )}
                </div>
                <div className="text-black" style={{ height: '26px' }}>
                    {!isLeftPlayer &&
                        gameInfo.state !== 'finished' &&
                        gameLeave?.message !== 'aborted' &&
                        gameLeave?.message !== 'left' &&
                        gameInfo.timeRemaining === 0 && (
                            <button
                                className="px-2 mr-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:outline-none rounded-lg"
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                            >
                                Resign
                            </button>
                        )}
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
                <ResignModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    socket={socket}
                    gameId={gameId}
                />
            </div>
            <MultiClassicMayhem
                gameObjects={gameInfo.objects}
                isLeftPlayer={isLeftPlayer}
                mode={gameInfo.mode}
                players={gameInfo.players}
                state={gameInfo.state}
                timeRemaining={gameInfo.timeRemaining}
                gameLeave={gameLeave}
                varElo={varElo}
                windowWidth={width}
                windowHeight={height}
            />
        </div>
    );
};

const GamePage: React.FC<{
    setGameId: (gameId: string | undefined) => void;
}> = ({ setGameId }) => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const socket = useContext(WebsocketContext);
    const { width, height } = useWindowSize();
    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
    const [gameLeave, setGameLeave] = useState<UpdateGameEvent | null>(null);
    const [varElo, setVarElo] = useState<eloVariation | null>(null);
    const { user } = useUserContext();

    useEffect(() => {
        const handleUpdateGameInfo = (newGameInfo: GameInfo) => {
            setGameInfo(newGameInfo);
        };

        const handleEventGame = (eventGameInfo: UpdateGameEvent) => {
            setGameLeave(eventGameInfo);
        };

        const handleEloVar = (data: eloVariation) => {
            setVarElo(data);
        };

        socket.on('updateGameInfo', handleUpdateGameInfo);

        socket.on('eventGame', handleEventGame);

        socket.on('varElo', handleEloVar);

        return () => {
            socket.off('updateGameInfo', handleUpdateGameInfo);
            socket.off('eventGame', handleEventGame);
            socket.off('varElo', handleEloVar);
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
        if (socket) {
            const switchGame = (gameId: string) => {
                console.log('switching game to', gameId);
                setGameId(gameId);
                setVarElo(null);
                setGameLeave(null);
                navigate(`/game/${gameId}`);
            };

            socket.on('switchGame', switchGame);

            return () => {
                socket.off('switchGame', switchGame);
            };
        }
    }, [socket, navigate, setGameId]);

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
            {gameInfo &&
                (gameInfo.mode === 'battle' ||
                    (gameInfo.players[0] && gameInfo.players[1])) && (
                    <Game
                        gameId={gameId}
                        gameInfo={gameInfo}
                        gameLeave={gameLeave}
                        varElo={varElo}
                        socket={socket}
                        user={user}
                        width={width}
                        height={height - PLAYERS_TEXT_SIZE}
                    />
                )}
        </div>
    );
};

export default GamePage;
