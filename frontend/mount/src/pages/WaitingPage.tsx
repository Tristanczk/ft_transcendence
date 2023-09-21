import React, { useContext, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { Socket } from 'socket.io-client';
import { NAVBAR_HEIGHT } from '../shared/misc';
import { useUserContext } from '../context/UserContext';

const leaveMatchmaking = (
    socket: Socket,
    setError: (error: string) => void,
    gameId: string | undefined,
    setGameId: (gameId: string | undefined) => void,
    navigate: NavigateFunction,
) => {
    const gameIdToLeave = gameId?.startsWith('waiting_')
        ? gameId.slice(8)
        : gameId;
    socket.emit('abortMatchmaking', gameIdToLeave, (response: any) => {
        if (response.error) {
            setError(response.error);
        } else {
            setGameId(undefined);
            navigate(-1);
        }
    });
};

const CancelButton = ({
    text,
    socket,
    setError,
    gameId,
    setGameId,
    navigate,
}: {
    text: string;
    socket: Socket;
    setError: React.Dispatch<React.SetStateAction<string>>;
    gameId: string | undefined;
    setGameId: (gameId: string | undefined) => void;
    navigate: NavigateFunction;
}) => (
    <button
        type="button"
        className=" rounded-md p-2 "
        onClick={() => {
            socket.emit('cancelInvitation', gameId);
            leaveMatchmaking(socket, setError, gameId, setGameId, navigate);
        }}
    >
        <span className="text-sm font-medium inline-flex items-center justify-center text-white hover:text-black focus:outline-none mt-2">
            <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            {text}
        </span>
    </button>
);

const WaitingPage: React.FC<{
    gameId: string | undefined;
    setGameId: (gameId: string | undefined) => void;
}> = ({ gameId, setGameId }) => {
    const socket = useContext(WebsocketContext);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { user } = useUserContext();
    let userId: number = -1;
    if (user) {
        userId = user.id;
    }

    useEffect(() => {
        if (socket) {
            const startGame = (gameId: string) => {
                setGameId(gameId);
                navigate(`/game/${gameId}`);
            };

            socket.on('startGame', startGame);

            return () => {
                socket.off('startGame', startGame);
            };
        }
    }, [socket, navigate, setGameId]);

    useEffect(() => {
        const cancelGame = () => {
            leaveMatchmaking(socket, setError, gameId, setGameId, navigate);
        };

        socket.on('cancelGame', cancelGame);

        return () => {
            socket.off('cancelGame', cancelGame);
        };
    }, [socket]);

    useEffect(() => {
        const handlePageRefresh = (event: BeforeUnloadEvent) => {
            leaveMatchmaking(socket, setError, gameId, setGameId, navigate);
        };

        window.addEventListener('beforeunload', handlePageRefresh);

        return () => {
            window.removeEventListener('beforeunload', handlePageRefresh);
            leaveMatchmaking(socket, setError, gameId, setGameId, navigate);
        };
    });
    console.log('gameId', gameId);

    return (
        <div
            className="flex flex-col justify-center items-center bg-rose-600 space-y-4 py-4"
            style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            <div role="status" className="flex flex-col items-center">
                <div className="dot-flashing"></div>
                <span className="text-white text-lg font-bold mt-2">
                    Waiting for your friend to accept the invitation...
                </span>
                <CancelButton
                    text="Cancel invitation"
                    socket={socket}
                    setError={setError}
                    gameId={gameId}
                    setGameId={setGameId}
                    navigate={navigate}
                />
                {error && <div className="text-white">{error}</div>}
            </div>
        </div>
    );
};

export default WaitingPage;
