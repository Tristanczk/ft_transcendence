import React, { useContext, useState } from 'react';
import { NAVBAR_HEIGHT } from '../constants';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { Socket } from 'socket.io-client';
import { GameMode } from '../shared/misc';
import { set } from 'date-fns';

const joinGame = (
    mode: GameMode,
    socket: Socket,
    navigate: NavigateFunction,
    setError: (error: string) => void,
    setErrorCode: (errorCode: string | undefined) => void,
    setGameId: (gameId: string | undefined) => void,
) => {
    socket.emit('joinGame', mode, (response: any) => {
        if (response.error) {
            setError(response.error);
            setErrorCode(response.errorCode);
            if (response.errorCode === 'alreadyInGame') {
                setGameId(response.gameId);
            }
        } else {
            setGameId(response.gameId);
            navigate(`/game/${response.gameId}`);
        }
    });
};

const GameButton = ({
    externalMode,
    internalMode,
    socket,
    navigate,
    setError,
    setErrorCode,
    setGameId,
}: {
    externalMode: string;
    internalMode: GameMode;
    socket: Socket;
    navigate: NavigateFunction;
    setError: (error: string) => void;
    setErrorCode: (errorCode: string | undefined) => void;
    setGameId: (gameId: string | undefined) => void;
}) => (
    <button
        className="flex justify-center items-center py-4 px-8 bg-white border-4 border-black text-black text-2xl font-mono tracking-widest hover:bg-black hover:text-white transition duration-300 w-2/3 max-w-sm"
        onClick={() =>
            joinGame(
                internalMode,
                socket,
                navigate,
                setError,
                setErrorCode,
                setGameId,
            )
        }
    >
        {externalMode}
    </button>
);

const HomePage: React.FC<{
    gameId: string | undefined;
    setGameId: (gameId: string | undefined) => void;
}> = ({ gameId, setGameId }) => {
    const navigate = useNavigate();
    const socket = useContext(WebsocketContext);
    const [error, setError] = useState<string>('');
    const [errorCode, setErrorCode] = useState<string | undefined>();
    const buttonParams = {
        socket,
        navigate,
        setError,
        setErrorCode,
        setGameId,
    };

    return (
        <div
            className="flex flex-col justify-center items-center bg-rose-600 space-y-4"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            <GameButton
                externalMode="CLASSIC"
                internalMode="classic"
                {...buttonParams}
            />
            <GameButton
                externalMode="MAYHEM"
                internalMode="mayhem"
                {...buttonParams}
            />
            <GameButton
                externalMode="BATTLE ROYALE"
                internalMode="battle"
                {...buttonParams}
            />
            {error && <div className="text-white">{error}</div>}
            {errorCode === 'alreadyInGame' && (
                <a
                    href={`/game/${gameId}`}
                    className="font-medium text-white hover:underline dark:text-primary-500"
                >
                    Rejoin game
                </a>
            )}
        </div>
    );
};

export default HomePage;
