import { ChannelProps } from './Messages';
import { UserSimplified } from '../../types';

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
    if (!currentChannel) return null;

    return (
        <>
            {channelUsers.length > 0 && (
                <div id="list" className="flex flex-col space-y-4 overflow-y-auto scrollbar-thumb-gray-500 scrollbar-thumb-rounded scrollbar-track-gray-200 scrollbar-w-2 scrolling-touch overflow-clip shadow-lg transition-all duration-500 ease-in-out rounded-b-xl h-48 bg-gray-100">
                    {channelUsers.map((user) => (
                        <div
                            key={user.id}
                            className="friend-container flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 hover:scale-110 rounded-xl p-2 shadow-md transition-transform transform duration-200 ease-in-out"
                            onClick={() => {
                                setChannelUsers([]);
                                handleClick(user.id);
                            }}
                        >
                            <span className="friend-name text-gray-800 font-medium">{user.nickname}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
