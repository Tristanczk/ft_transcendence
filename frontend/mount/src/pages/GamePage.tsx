import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { useWindowSize } from 'usehooks-ts';
import { GameInfo } from '../shared/game_info';
import { ApiResult, KeyEventType, NAVBAR_HEIGHT } from '../shared/misc';
import MultiClassicMayhem from '../games/multiplayer/MultiClassicMayhem';
import MultiBattleRoyale from '../games/multiplayer/MultiBattleRoyale';

const Game = ({
    gameInfo,
    width,
    height,
}: {
    gameInfo: GameInfo;
    width: number;
    height: number;
}) =>
    gameInfo.mode === 'battle' ? (
        <MultiBattleRoyale
            gameObjects={gameInfo.objects}
            players={gameInfo.players}
            windowWidth={width}
            windowHeight={height}
        />
    ) : (
        <MultiClassicMayhem
            gameObjects={gameInfo.objects}
            players={gameInfo.players}
            timeRemaining={gameInfo.timeRemaining}
            windowWidth={width}
            windowHeight={height}
        />
    );

const GamePage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const socket = useContext(WebsocketContext);
    const { width, height } = useWindowSize();
    const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

    console.log('socket id', socket.id);
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

		document.addEventListener('keydown', function(event) {
			if (event.key === "q" || event.key === "Q") {
				// La touche "Q" a été appuyée
				socket.emit('quitGame', gameId );
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
