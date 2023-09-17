import { useUserContext } from '../../context/UserContext';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import SettingBar from './SettingBar';

export interface ChannelProps {
    id: number;
    idAdmin: number[];
    idUser: number[];
    name: string;
    isPublic: boolean;
}

export interface MessageProps {
    id: number;
    idSender: number;
    idChannel: number;
    message: string;
    createdAt: Date;
}

export interface MessageGroup {
    idSender: number;
    messages: MessageProps[];
}

export default function Messages({
    messages,
    isSettingVisible,
    currentChannel,
    zIndexClass,
    handleClose,
    channelUsers,
    fetchUsers,
    blockedUsers,
    setChannelUsers,
}: {
    messages: MessageProps[];
    isSettingVisible: boolean;
    currentChannel: ChannelProps | null;
    zIndexClass: string;
    handleClose: () => void;
    channelUsers: UserSimplified[];
    fetchUsers: () => void;
    blockedUsers: number[];
    setChannelUsers: (users: UserSimplified[]) => void;
}) {
    const { user } = useUserContext();

    if (!messages) return <div></div>;

    function groupMessagesBySender(messages: MessageProps[]) {
        let groupedMessages: MessageGroup[] = [];
        let currentGroup: MessageGroup | null = null;

        messages.forEach((message) => {
            if (blockedUsers.includes(message.idSender)) return;

            if (currentGroup && currentGroup.idSender === message.idSender) {
                currentGroup.messages.push(message);
            } else {
                if (currentGroup) {
                    groupedMessages.push(currentGroup);
                }
                currentGroup = {
                    idSender: message.idSender,
                    messages: [message],
                };
            }
        });

        if (currentGroup) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    }

    const groupedMessages = groupMessagesBySender(messages);
    
    return (
        <div className="flex">
            {' '}
            {/* Parent container with relative positioning */}
            {/* Sidebar content */}
            <SettingBar
                currentChannel={currentChannel}
                isSettingVisible={isSettingVisible}
                handleClose={handleClose}
                channelUsers={channelUsers}
                fetchUsers={fetchUsers}
                setChannelUsers={setChannelUsers}
            />
            <div
                id="messages"
                className={`flex-grow flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch bg-white shadow-2xl overflow-clip w-104 ${zIndexClass}`}
                style={{ height: '420px', marginLeft: '-69px' }}
            >
                {groupedMessages.map(
                    (group: MessageGroup, groupIndex: number) => {
                        const isCurrentUser = group.idSender === user?.id;

                        return (
                            <div className="chat-message" key={groupIndex}>
                                <div
                                    className={`flex items-end ${
                                        isCurrentUser ? 'justify-end' : ''
                                    }`}
                                >
                                    <div
                                        className={`flex flex-col space-y-2 text-sm max-w-xs mx-2 ${
                                            isCurrentUser
                                                ? 'order-1 items-end'
                                                : 'order-2 items-start'
                                        }`}
                                    >
                                        {group.messages.map(
                                            (message: any, index: any) => (
                                                <div key={index}>
                                                    <span
                                                        className={`${
                                                            isCurrentUser
                                                                ? 'rounded-br-none bg-blue-600 text-white'
                                                                : 'rounded-bl-none bg-gray-300 text-gray-600'
                                                        } px-4 py-2 rounded-lg inline-block`}
                                                    >
                                                        {message.message}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                    {isCurrentUser ? (
                                        <ImageFriend
                                            customClassName={`w-8 h-8 rounded-full ${
                                                isCurrentUser
                                                    ? 'order-2'
                                                    : 'order-1'
                                            }`}
                                            userId={group.idSender}
                                        />
                                    ) : (
                                        <ImageFriend
                                            customClassName={`w-8 h-8 rounded-full ${
                                                isCurrentUser
                                                    ? 'order-2'
                                                    : 'order-1'
                                            }`}
                                            userId={group.idSender}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    },
                )}
            </div>
        </div>
    );
}
