import { useEffect, useState } from 'react';
import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';

export default function ChannelUserForm({
    currentChannel,
    channelUsers,
    handleClick,
    setChannelUsers,
}: {
    currentChannel: ChannelProps | null;
    channelUsers: UserSimplified[];
    handleClick: (idUser: number) => void;
    setChannelUsers: (users: UserSimplified[]) => void;
}) {
    if (!currentChannel) return <></>;

    return (
        <>
            {channelUsers.length > 0 && (
                <form>
                    {channelUsers.map((user) => (
                        <div
                            onClick={() => {
                                setChannelUsers([]);
                                handleClick(user.id);
                            }}
                            key={user.id}
                        >
                            {user.nickname}
                        </div>
                    ))}
                </form>
            )}
        </>
    );
}
