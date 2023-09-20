interface AlertProps {
    message: string;
    onClose: () => void;
}

export function Alert({ message, onClose }: AlertProps) {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 z-50">
            <div className="bg-zinc-200 rounded-lg p-5 max-w-md">
                <p className="text-red-600 mb-4">{message}</p>
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
