import React, { useContext, useState } from 'react';
import { NAVBAR_HEIGHT } from '../constants';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { WebsocketContext } from '../context/WebsocketContext';
import { Socket } from 'socket.io-client';
import { GameMode } from '../shared/misc';

const activateMatchmaking = true;

const joinGame = (
    mode: GameMode,
    socket: Socket,
    navigate: NavigateFunction,
    setError: (error: string) => void,
    setErrorCode: (errorCode: string | undefined) => void,
    setGameId: (gameId: string | undefined) => void,
    setMatchmaking: (matchmaking: boolean) => void,
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
            if (response.status === 'waiting') {
                if (activateMatchmaking) setMatchmaking(true);
                else navigate(`/game/${response.gameId}`);
            } else {
                navigate(`/game/${response.gameId}`);
            }
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
    setMatchmaking,
}: {
    externalMode: string;
    internalMode: GameMode;
    socket: Socket;
    navigate: NavigateFunction;
    setError: (error: string) => void;
    setErrorCode: (errorCode: string | undefined) => void;
    setGameId: (gameId: string | undefined) => void;
    setMatchmaking: (matchmaking: boolean) => void;
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
                setMatchmaking,
            )
        }
    >
        {externalMode}
    </button>
);

const CancelButton = ({
    text,
    socket,
    setMatchmaking,
}: {
    text: string;
    socket: Socket;
    setMatchmaking: (matchmaking: boolean) => void;
}) => (
    <button
        type="button"
        className=" rounded-md p-2 "
        onClick={() => setMatchmaking(false)}
    >
        <span className="text-sm font-medium inline-flex items-center justify-center text-white hover:text-gray-500 focus:outline-none mt-2">
            <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            Cancel matchmaking
        </span>
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
    const [matchmaking, setMatchmaking] = useState<boolean>(false);
    const buttonParams = {
        socket,
        navigate,
        setError,
        setErrorCode,
        setGameId,
        setMatchmaking,
    };

    return (
        <div
            className="flex flex-col justify-center items-center bg-rose-600 space-y-4"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            {!matchmaking ? (
                <>
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
                </>
            ) : (
                <div role="status" className="flex flex-col items-center">
                    <svg
                        aria-hidden="true"
                        className="w-24 h-24 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-900"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                    <label className="text-white text-lg font-bold mt-2">
                        Waiting for a worthy opponent...
                    </label>
                    <CancelButton
                        text="Cancel matchmaking"
                        socket={socket}
                        setMatchmaking={setMatchmaking}
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;
