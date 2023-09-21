import { Link } from 'react-router-dom';
import { UserSimplified } from '../../../types';
import ImageFriend from './ImageFriend';

interface Props {
    list: UserSimplified[] | null;
    ButtonAddFriend: any;
    ButtonDeleteFriend: any;
}

function ReturnAddFriend({ list, ButtonAddFriend, ButtonDeleteFriend }: Props) {
    return (
        list && (
            <>
                <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                            Users
                        </h5>
                        {/* <a
                            href="#"
                            className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-600"
                        >vie</a> */}
                    </div>
                    <div className="flow-root">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {list.length > 0 ? (
                                list.map((user) => (
                                    <li className="py-3 sm:py-4" key={user.id}>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <ImageFriend
                                                    userId={user.id}
                                                    textImg={user.nickname}
                                                    size={8}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white hover:font-bold">
                                                    <Link
                                                        to={
                                                            '/dashboard/' +
                                                            user.id
                                                        }
                                                    >
                                                        {user.nickname}
                                                    </Link>
                                                </p>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {user.elo}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                {!user.isYourFriend ? (
                                                    <button
                                                        onClick={(event) =>
                                                            ButtonAddFriend(
                                                                event,
                                                                user.id,
                                                            )
                                                        }
                                                        type="button"
                                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-rose-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M7 1v12m6-6H1"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">
                                                            Icon description
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(event) =>
                                                            ButtonDeleteFriend(
                                                                event,
                                                                user.id,
                                                            )
                                                        }
                                                        type="button"
                                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-rose-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M3 3l10 10m0-10L3 13"
                                                            />
                                                        </svg>
                                                        <span className="sr-only">
                                                            Icon description
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <div>No user found</div>
                            )}
                        </ul>
                    </div>
                </div>
            </>
        )
    );
}

export default ReturnAddFriend;
