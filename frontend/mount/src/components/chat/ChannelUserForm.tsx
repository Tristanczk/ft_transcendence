import { useEffect, useState } from 'react';
import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import { useUserContext } from '../../context/UserContext';

export default function ChannelUserForm({
    currentChannel,
    channelUsers,
    handleClick,
}: {
    currentChannel: ChannelProps | null;
    channelUsers: UserSimplified[];
    handleClick: (idUser: number) => void;
}) {
    if (!currentChannel) return <></>;

    return (
        <>
            <form>
                {channelUsers &&
                    channelUsers.map((user) => (
                        <div onClick={() => handleClick(user.id)} key={user.id}>
                            {user.nickname}
                        </div>
                    ))}
            </form>
        </>
    );
}
