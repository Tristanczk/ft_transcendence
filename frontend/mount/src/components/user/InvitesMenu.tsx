import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../context/WebsocketContext';
import OutsideClickHandler from 'react-outside-click-handler';
import { useUserContext } from '../../context/UserContext';
import { JoinFriendGameType } from '../../pages/ChatPage';
import { useNavigate } from 'react-router-dom';
import { Invite } from '../../shared/game_info';

export default function InvitesMenu({
    setShowInvites,
    setGameId,
    invites,
    setInvites,
}: {
    setShowInvites: (showInvites: boolean) => void;
    setGameId: (gameId: string | undefined) => void;
    invites: Invite[];
    setInvites: React.Dispatch<React.SetStateAction<Invite[]>>;
}) {
    const socket = useContext(WebsocketContext);
    const { user } = useUserContext();
    const navigate = useNavigate();
    for (const invite of invites) {
        console.log('invite', invite);
    }
    const handleGameInvite = async (data: Invite) => {
        if (!user) return; //TO DO display an error message impossible to send game invite
        const joinFriendGame: JoinFriendGameType = {
            mode: data.gameMode,
            userId: user.id,
            gameId: data.gameId,
            friendId: null,
        };
        socket.emit('joinFriendGame', joinFriendGame, (response: any) => {
            if (response.error) {
                //TO DO : display an error message equal to response.error
                if (response.errorCode === 'alreadyInGame') {
                    setGameId(response.gameId);
                }
            } else {
                setGameId(response.gameId);
                setShowInvites(false);
                setInvites((prev) =>
                    prev.filter((invite) => invite.gameId !== data.gameId),
                );
                navigate(`/game/${data.gameId}`);
            }
        });
    };

    const handleRefusal = async (data: Invite) => {
        console.log('refuse');
        socket.emit(
            'refuseGameInvite',
            { userId: user!.id, gameId: data.gameId },
            (response: any) => {
                if (response.status === 'failure') {
                    //TO DO : display an error message equal to response.error
                }
                setInvites((prev) =>
                    prev.filter((invite) => invite.gameId !== data.gameId),
                );
            },
        );
        setShowInvites(false);
    };

    return (
        <OutsideClickHandler onOutsideClick={() => setShowInvites(false)}>
            <ul
                id="listinvites"
                className="z-50 absolute top-full right-0 mt-2 w-48 py-2 rounded-md shadow-xl bg-gray-800 space-y-4 overflow-y-auto scrolling-touch overflow-clip shadow-lg transition-all duration-500 ease-in-out rounded-b-xl h-48 bg-gray-100"
            >
                {invites &&
                    invites.map((invite) => (
                        <div
                            className="flex items-center justify-between p-4 transition-colors duration-300 flex items-center justify-center cursor-pointer rounded-xl p-2 shadow-md transition-transform transform duration-200 ease-in-out"
                            onClick={() => {}}
                        >
                            <span className="px-4 py-2 text-sm text-gray-200 hover:text-white">
                                {invite.userName}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowInvites(false);
                                    handleGameInvite(invite);
                                }}
                                className="inline-flex items-center justify-center rounded-lg h-8 w-8 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-green-500 hover:scale-110"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                    />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRefusal(invite)}
                                className="inline-flex items-center justify-center rounded-lg h-8 w-8 transition duration-500 ease-in-out focus:outline-none bg-slate-200 hover:text-white hover:bg-rose-500 hover:scale-110"
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
                    ))}
            </ul>
        </OutsideClickHandler>
    );
}
