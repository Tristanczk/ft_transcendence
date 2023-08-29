import axios from 'axios';
import { useEffect, useState } from 'react';
import ReturnAddFriend from './ReturnAddFriend';
import { UserSimplified } from '../../../types';
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
        console.log('here ' + e.target.value);
        getPossibleFriendsList(e.target.value);
    }

    async function getPossibleFriendsList(nickname: string) {
        if (nickname.length >= 1) {
            console.log('try ' + nickname);
            try {
                const response = await authAxios.get(
                    `http://localhost:3333/friends/select/${nickname}`,
                    { withCredentials: true },
                );
                setPossibleFriends(response.data);
            } catch (error) {
                console.error(error);
            }
        } else {
            setPossibleFriends(null);
        }
    }

    useEffect(() => {
        getPossibleFriendsList(nick);
        setChange(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change]);

    return (
        <>
            <label
                htmlFor="website-admin"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Nickname
            </label>
            <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                    </svg>
                </span>
                <input
                    onChange={(e) => handleOnChange(e)}
                    type="text"
                    id="website-admin"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search by nickname"
                />
            </div>
            <ReturnAddFriend
                list={possibleFriends}
                ButtonAddFriend={ButtonAddFriend}
                ButtonDeleteFriend={ButtonDeleteFriend}
            />
        </>
    );
}

export default AddFriendElem;
