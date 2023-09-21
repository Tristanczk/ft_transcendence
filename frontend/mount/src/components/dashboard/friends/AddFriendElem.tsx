import React, { useEffect, useState } from 'react';
import ReturnAddFriend from './ReturnAddFriend';
import { UserSimplified } from '../../../types';
import OutsideClickHandler from 'react-outside-click-handler';
import { useAuthAxios } from '../../../context/AuthAxiosContext';

interface Props {
    ButtonAddFriend: any;
    ButtonDeleteFriend: any;
    change: boolean;
    setChange: any;
}

function AddFriendElem({
    ButtonAddFriend,
    ButtonDeleteFriend,
    change,
    setChange,
}: Props) {
    const [nick, setNick] = useState<string>('');
    const [possibleFriends, setPossibleFriends] = useState<
        UserSimplified[] | null
    >(null);
    const authAxios = useAuthAxios();

    async function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setNick(e.target.value);
        getPossibleFriendsList(e.target.value);
    }

    async function getPossibleFriendsList(nickname: string) {
        if (nickname.length >= 1) {
            try {
                const response = await authAxios.get(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/friends/select/${nickname}`,
                    { withCredentials: true },
                );
                setPossibleFriends(response.data);
            } catch {}
        } else {
            setPossibleFriends(null);
        }
    }

    useEffect(() => {
        getPossibleFriendsList(nick);
        setChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change]);

    let [showInfo, setShowInfo] = useState(true);

    return (
        <>
            <OutsideClickHandler
                onOutsideClick={() => {
                    setShowInfo(false);
                }}
            >
                <form>
                    <label
                        htmlFor="search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search nickname
                    </label>
                    <div
                        className="relative"
                        onClick={() => {
                            setShowInfo(true);
                        }}
                    >
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            onChange={(e) => handleOnChange(e)}
                            id="search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search username"
                            required
                        />
                    </div>
                </form>

                {showInfo && (
                    <ReturnAddFriend
                        list={possibleFriends}
                        ButtonAddFriend={ButtonAddFriend}
                        ButtonDeleteFriend={ButtonDeleteFriend}
                    />
                )}
            </OutsideClickHandler>
        </>
    );
}

export default AddFriendElem;
