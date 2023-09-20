import { Link } from 'react-router-dom';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import ShowIsOnline from '../dashboard/friends/ShowIsOnline';
import { useState } from 'react';
import { GameModeAlert } from './GameModeAlert';

export default function MessagesHeader({
    channel,
    currentFriend,
    handleClose,
    handleBlock,
    handleGameInvite,
}: {
    channel: number;
    currentFriend: UserSimplified | null;
    handleClose: () => void;
    handleBlock: () => void;
    handleGameInvite: (mode: 'classic' | 'mayhem' | 'battle') => void;
}) {
    const [alert, setAlert] = useState<boolean>(false);

    if (channel === 0 || !currentFriend) return <div></div>;

    const onClose = () => {
        setAlert(false);
    };

    return (
        <>
            {alert && (
                <GameModeAlert
                    onClose={onClose}
                    handleClick={handleGameInvite}
                />
            )}
            <div className="flex sm:items-center justify-between py-3 bg-slate-100 px-3 rounded-tl-3xl rounded-tr-3xl shadow-2xl">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <span className="absolute text-green-500 right-0 bottom-0">
                            {/* <svg width="20" height="20">
                            <circle
                                cx="8"
                                cy="8"
                                r="8"
                                fill={
                                    currentFriend.isConnected
                                        ? '#4ade80'
                                        : '#f43f5e'
                                }
                            ></circle>
                        </svg> */}
                            <ShowIsOnline
                                userId={currentFriend.id}
                                initStatus={currentFriend.isConnected}
                                playingStatus={currentFriend.isPlaying}
                                text={false}
                            />
                        </span>
                        <ImageFriend
                            userId={currentFriend.id}
                            textImg={currentFriend.nickname}
                            customClassName="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                        />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-2xl mt-1 flex items-center">
                            <Link to={'/dashboard/' + currentFriend.id}>
                                <button className="group inline-block hover:text-blue-600 text-gray-600 mr-3 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-blue-600 mr-3">
                                    {currentFriend.nickname}
                                </button>
                            </Link>
                        </div>
                        <Link to={'/leaderboard/'}>
                            <button className="group inline-block hover:text-blue-600 text-gray-600 mr-3 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-blue-600 mr-3">
                                🏆 {currentFriend.elo} ELO
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setAlert(true)}
                        className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-amber-400 hover:scale-110"
                    >
                        <svg
                            fill="#000000"
                            stroke="currentColor"
                            className="h-6 w-6 text-slate-500 hover:text-white"
                            version="1.1"
                            id="Layer_1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 511.983 511.983"
                        >
                            <g>
                                <g>
                                    <g>
                                        <path
                                            d="M125.491,267.021c-3.337-3.337-8.73-3.337-12.066,0c-25.301,25.293-25.813,53.094-1.707,78.507l-53.896,53.888
				l-8.866-8.798c-6.647-6.656-17.468-6.673-24.098-0.043L4.992,410.449c-6.656,6.647-6.656,17.476,0,24.132l72.397,72.405
				c3.328,3.328,7.706,4.992,12.075,4.992c4.369,0,8.747-1.664,12.066-4.992l19.866-19.857c3.482-3.482,5.163-8.346,4.625-13.346
				c-0.495-4.582-2.756-8.994-6.536-12.774l-6.912-6.878l53.837-53.828c25.762,24.525,52.873,23.927,78.549-1.749
				c3.337-3.337,3.337-8.73,0-12.066L125.491,267.021z M176.649,386.445l-4.301-4.241c-3.336-3.285-8.695-3.268-12.023,0.043
				l-59.836,59.844L87.04,428.702c-3.336-3.328-8.73-3.311-12.075,0.026c-3.328,3.337-3.311,8.738,0.026,12.066l32.435,32.299
				c1.263,1.254,1.587,2.236,1.86,2.014l-19.831,19.814l-72.397-72.405l19.857-19.806l14.925,14.814
				c3.328,3.302,8.721,3.294,12.041-0.026l59.827-59.836l15.317,15.352c3.337,3.337,8.73,3.337,12.066,0.017
				c3.345-3.328,3.345-8.738,0.017-12.075l-25.617-25.668c-9.591-9.6-14.473-19.021-14.498-28.023
				c-0.017-7.049,2.935-14.362,8.798-21.803l106.752,106.743C209.604,405.679,193.971,403.785,176.649,386.445z"
                                        />
                                        <path
                                            d="M287.625,176.687L430.933,33.378l45.773-10.172L305.425,194.487c-3.337,3.337-3.337,8.73,0,12.066
				c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5L488.764,35.281l-10.163,45.764L335.292,224.354
				c-3.337,3.337-3.337,8.73,0,12.066c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5L492.425,91.354
				c1.152-1.143,1.946-2.594,2.304-4.181l17.067-76.8c0.111-0.521,0.12-1.05,0.137-1.57c0.009-0.128,0.043-0.256,0.043-0.384
				c-0.017-0.973-0.213-1.911-0.546-2.816c-0.077-0.205-0.171-0.393-0.265-0.589c-0.418-0.922-0.939-1.792-1.673-2.526
				c-0.734-0.734-1.604-1.254-2.517-1.673c-0.205-0.094-0.393-0.188-0.597-0.265c-0.904-0.324-1.843-0.529-2.807-0.546
				c-0.145,0-0.273,0.034-0.418,0.043c-0.521,0.017-1.033,0.034-1.544,0.145l-76.8,17.067c-1.579,0.35-3.029,1.143-4.181,2.295
				L275.558,164.621c-3.337,3.337-3.337,8.73,0,12.066S284.288,180.023,287.625,176.687z"
                                        />
                                        <path
                                            d="M506.991,410.449l-19.857-19.866c-6.007-6.016-16.922-7.296-26.129,1.92l-6.861,6.895l-53.837-53.828
				c24.516-25.754,23.936-52.864-1.749-78.549c-3.337-3.337-8.73-3.337-12.066,0L267.025,386.487c-3.337,3.337-3.337,8.73,0,12.066
				c25.301,25.301,53.111,25.813,78.507,1.707l53.897,53.897l-8.806,8.866c-6.656,6.656-6.673,17.468-0.034,24.098l19.866,19.866
				c3.319,3.328,7.697,4.992,12.066,4.992s8.747-1.664,12.075-4.992l72.397-72.397C513.647,427.934,513.647,417.097,506.991,410.449
				z M422.519,494.921l-19.806-19.857l14.814-14.925c3.302-3.337,3.294-8.721-0.026-12.041l-59.836-59.836l15.352-15.309
				c3.345-3.328,3.345-8.73,0.017-12.075c-3.336-3.328-8.738-3.337-12.066-0.009l-25.677,25.617
				c-9.6,9.591-19.029,14.473-28.023,14.498h-0.077c-7.023,0-14.31-2.953-21.726-8.806l106.743-106.735
				c13.483,16.922,11.563,32.555-5.769,49.886l-4.233,4.301c-3.285,3.345-3.268,8.713,0.051,12.023l59.836,59.836l-13.397,13.449
				c-3.319,3.336-3.302,8.747,0.026,12.066c3.354,3.337,8.747,3.319,12.075-0.026l32.29-32.427c1.263-1.254,2.219-1.587,2.022-1.86
				l19.814,19.831L422.519,494.921z"
                                        />
                                        <path
                                            d="M281.591,349.854c2.185,0,4.369-0.836,6.033-2.5c3.336-3.337,3.336-8.73,0-12.066L33.382,81.045L23.219,35.281
				l282.206,282.206c1.664,1.664,3.849,2.5,6.033,2.5c2.185,0,4.369-0.836,6.033-2.5c3.337-3.337,3.337-8.73,0-12.066L35.277,23.206
				L81.05,33.378L335.292,287.62c3.337,3.337,8.73,3.337,12.066,0c3.336-3.337,3.336-8.73,0-12.066l-256-256
				c-1.152-1.152-2.603-1.946-4.181-2.295l-76.8-17.067C9.865,0.081,9.353,0.064,8.832,0.047C8.687,0.038,8.559,0.004,8.414,0.004
				C7.441,0.021,6.511,0.226,5.606,0.55C5.402,0.627,5.214,0.721,5.018,0.815c-0.922,0.41-1.792,0.939-2.526,1.673
				C1.758,3.221,1.229,4.092,0.819,5.013C0.725,5.21,0.631,5.397,0.555,5.602C0.222,6.507,0.026,7.445,0.009,8.418
				c0,0.128,0.034,0.256,0.043,0.384c0.017,0.521,0.026,1.05,0.137,1.57l17.067,76.8c0.358,1.587,1.152,3.038,2.304,4.181
				l164.634,164.634l-19.567,19.567c-3.337,3.337-3.337,8.73,0,12.066c1.664,1.664,3.849,2.5,6.033,2.5s4.369-0.836,6.033-2.5
				l19.567-19.567l17.8,17.801l-19.567,19.567c-3.337,3.336-3.337,8.73,0,12.066c1.664,1.664,3.849,2.5,6.033,2.5
				c2.185,0,4.369-0.836,6.033-2.5l19.567-19.567l17.801,17.801l-19.567,19.567c-3.337,3.337-3.337,8.73,0,12.066
				c1.664,1.664,3.849,2.5,6.033,2.5s4.369-0.836,6.033-2.5l19.567-19.567l19.567,19.567
				C277.222,349.018,279.407,349.854,281.591,349.854z"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </button>
                    <Link to={'/dashboard/' + currentFriend.id}>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500 hover:scale-110"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6 text-slate-500 hover:text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </button>
                    </Link>
                    <button
                        type="button"
                        onClick={handleBlock}
                        className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500 hover:scale-110"
                    >
                        <svg
                            className="h-6 w-6 text-slate-500 hover:text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {' '}
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{' '}
                            <circle cx="8.5" cy="7" r="4" />{' '}
                            <line x1="18" y1="8" x2="23" y2="13" />{' '}
                            <line x1="23" y1="8" x2="18" y2="13" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center justify-center rounded-lg h-10 w-10 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500 hover:scale-110"
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
            </div>
        </>
    );
}
