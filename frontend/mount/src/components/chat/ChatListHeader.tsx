export default function ChatListHeader({
    selector,
    handleClose,
    channelListSelected,
}: {
    selector: (state: number) => void;
    handleClose: () => void;
    channelListSelected: number;
}) {
    return (
        <div className=" flex items-center justify-between bg-gray-50 px-3 rounded-tl-3xl rounded-tr-3xl shadow-md">
            <div className="flex items-center space-x-1">
                <button
                    onClick={() => selector(1)}
                    className={`rounded-t-3xl px-4 py-2 mt-1 text-lg text-gray-600 hover:text-gray-900 transition duration-400 focus:outline-none ${channelListSelected === 1 ? 'bg-zinc-100 shadow-inner' : 'bg-gray-100'}`}
                >
                    Friends 😁
                </button>

                <button
                    onClick={() => selector(0)}
                    className={`rounded-t-3xl px-4 py-2 mt-1 text-lg text-gray-600 hover:text-gray-900 transition duration-400 focus:outline-none ${channelListSelected === 0 ? 'bg-zinc-100 shadow-inner' : 'bg-gray-100'}`}
                >
                    Channels 💬
                </button>
            </div>

            <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-400 ease-in-out focus:outline-none bg-gray-200 hover:bg-red-500 transform hover:scale-110"
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
    );
}
