export default function ChatListHeader({
    selector,
    handleClose,
}: {
    selector: (state: number) => void;
    handleClose: () => void;
}) {
    return (
        <div className="flex sm:items-center justify-between py-1 bg-slate-100 px-3 rounded-tl-3xl rounded-tr-3xl shadow-2xl">
            <div className="relative flex items-center space-x-4">
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span
                            onClick={() => selector(1)}
                            className="text-gray-700 mr-3"
                        >
                            Friends
                        </span>
                    </div>
                </div>
            </div>
            <div className="relative flex items-center space-x-4">
                <div className="flex flex-col leading-tight">
                    <div className="text-2xl mt-1 flex items-center">
                        <span
                            onClick={() => selector(0)}
                            className="text-gray-700 mr-3"
                        >
                            Channels
                        </span>
                    </div>
                </div>
            </div>
            <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500"
                >
                    <svg
                        className="h-6 w-6 text-slate-500 hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        {' '}
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
