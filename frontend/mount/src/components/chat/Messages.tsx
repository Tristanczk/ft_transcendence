import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { UserSimplified } from '../../types';
import ImageFriend from '../dashboard/friends/ImgFriend';
import SettingBar from './SettingBar';
import { GameMode } from '../../shared/misc';
import { GameModeAlert } from './GameModeAlert';

const addBreakpointInLongWords = (message: string) =>
    message.replace(/(\S{34})/g, '$1- ');

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

const ImageChat: React.FC<{ isCurrentUser: boolean; idSender: number }> = ({
    isCurrentUser,
    idSender,
}) => (
    <ImageFriend
        customClassName={`w-8 h-8 rounded-full ${
            isCurrentUser ? 'order-2' : 'order-1'
        }`}
        userId={idSender}
    />
);

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
    handleGameInvite,
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
    handleGameInvite: (mode: GameMode, idUser: number) => void;
}) {
    const { user } = useUserContext();
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const groupedMessages = groupMessagesBySender(messages);

    const [alert, setAlert] = useState<boolean>(false);
    const [friendClicked, setFriendClicked] = useState<number>(0);
    const onClose = () => {
        setAlert(false);
    };

    useEffect(() => {
        // Scroll to the bottom of the container
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight;
        }
    }, [groupedMessages]);

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

    return (
        <>
            {alert && (
                <GameModeAlert
                    onClose={onClose}
                    handleClick={handleGameInvite}
                    friendClicked={friendClicked}
                />
            )}
            <div className="flex">
                {' '}
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
                    ref={messageContainerRef}
                    className={`flex-grow h-full flex flex-col space-y-4 p-3 overflow-y-auto scrolling-touch bg-white shadow-md overflow-clip transition-all duration-500 w-80 ml-[-53px] min-h-[232px] max-h-[232px] sm:min-h-[240px] sm:max-h-[240px] md:w-96 md:ml-[-64px] md:min-h-[420px] md:max-h-[420px] lg:w-104 lg:ml-[-69px] '${zIndexClass}`}
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
                                            className={`flex flex-col space-y-2 text-sm max-w-xs mx-2 z-auto ${
                                                isCurrentUser
                                                    ? 'order-1 items-end'
                                                    : 'order-2 items-start'
                                            }`}
                                        >
                                            {group.messages.map(
                                                (message, index) => {
                                                    const processedMessage =
                                                        addBreakpointInLongWords(
                                                            message.message,
                                                        );

                                                    return (
                                                        <div key={index}>
                                                            <span
                                                                className={`${
                                                                    isCurrentUser
                                                                        ? 'rounded-br-none bg-blue-600 text-white'
                                                                        : 'rounded-bl-none bg-gray-300 text-gray-600'
                                                                } transition-all duration-500 px-4 py-2 w-64 md:w-full rounded-lg inline-block`}
                                                            >
                                                                {
                                                                    processedMessage
                                                                }
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                        {isCurrentUser ? (
                                            <ImageChat
                                                idSender={group.idSender}
                                                isCurrentUser={isCurrentUser}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setFriendClicked(
                                                        group.idSender,
                                                    );
                                                    setAlert(true);
                                                }}
                                            >
                                                <ImageChat
                                                    idSender={group.idSender}
                                                    isCurrentUser={
                                                        isCurrentUser
                                                    }
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            </div>
        </>
    );
}
