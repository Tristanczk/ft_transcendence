import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';
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
    const { user } = useUserContext();
    if (!currentChannel) return <></>;

    return (
        <>
            {channelUsers.length > 0 && (
                <form>
                    {channelUsers
                    .filter(currentUser => currentUser.id !== user?.id)
                    .map((currentUser) => (
                        <div
                            onClick={() => {
                                handleClick(currentUser.id);
                                setChannelUsers([]);
                            }}
                            key={currentUser.id}
                        >
                            {currentUser.nickname}
                        </div>
                    ))}
                </form>
            )}
        </>
    );
}
