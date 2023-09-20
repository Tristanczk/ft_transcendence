interface GameModeAlertProps {
    onClose: () => void;
    handleClick: (mode: 'classic' | 'mayhem' | 'battle') => void;
}

export function GameModeAlert({ onClose, handleClick }: GameModeAlertProps) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 z-50">
            <div className="bg-zinc-200 rounded-lg p-5 max-w-md">
                <div className="flex items-center justify-center mb-4">
                    <p className="text-center text-gray-500 text-lg font-semibold">
                        Choose your gamemode
                    </p>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-2 inline-flex items-center justify-center rounded-full h-6 w-6 transition duration-400 ease-in-out focus:outline-none bg-gray-200 hover:bg-red-500 transform hover:scale-110"
                    >
                        <svg
                            className="h-4 w-4 text-gray-700 hover:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <button
                    className="hover:scale-105 hover:bg-green-500 bg-gray-500 text-white py-2 px-4 rounded-md focus:outline-none mb-2 mx-1"
                    onClick={() => handleClick('classic')}
                >
                    Classic
                </button>
                <button
                    className="hover:scale-105 hover:bg-green-500 bg-gray-500 text-white py-2 px-4 rounded-md focus:outline-none mb-2 mx-1"
                    onClick={() => handleClick('mayhem')}
                >
                    Mayhem
                </button>
                <button
                    className="hover:scale-105 hover:bg-green-500 bg-gray-500 text-white py-2 px-4 rounded-md focus:outline-none mb-2 mx-1"
                    onClick={() => handleClick('battle')}
                >
                    Royal
                </button>
            </div>
        </div>
    );
}
