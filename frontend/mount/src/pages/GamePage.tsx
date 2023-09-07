import React, { useContext, useEffect, useState } from 'react';
import { NAVBAR_HEIGHT } from '../constants';
import { useNavigate, useParams } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { useWindowSize } from 'usehooks-ts';
import ClassicGame from '../games/ClassicGame';
import MayhemGame from '../games/MayhemGame';
import BattleGame from '../games/BattleGame';
import { GameInfo } from '../shared/game_info';
import { ApiResult, KeyEventType } from '../shared/misc';

const Game = ({
    gameInfo,
    width,
    height,
}: {
    gameInfo: GameInfo;
    width: number;
    height: number;
}) => {
    const gameParams = {
        players: gameInfo.players,
        windowWidth: width,
        windowHeight: height,
    };
    return gameInfo.mode === 'classic' ? (
        <ClassicGame gameObjects={gameInfo.objects} {...gameParams} />
    ) : gameInfo.mode === 'mayhem' ? (
        <MayhemGame gameObjects={gameInfo.objects} {...gameParams} />
    ) : (
        <BattleGame gameObjects={gameInfo.objects} {...gameParams} />
    );
};

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const socket = useContext(WebsocketContext);
    const { width, height } = useWindowSize();
    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

    useEffect(() => {
        const handleUpdateGameInfo = (newGameInfo: GameInfo) => {
            setGameInfo(newGameInfo);
        };

        socket.on('updateGameInfo', handleUpdateGameInfo);

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
                <Game gameInfo={gameInfo} width={width} height={height} />
            )}
        </div>
    );
};

export default GamePage;
