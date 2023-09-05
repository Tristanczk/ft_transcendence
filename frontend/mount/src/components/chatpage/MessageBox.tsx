import React from 'react';
import { useUserContext } from '../../context/UserContext';
import { MessageProps } from '../chat/Messages';

export function MessageBox({ idSender, idChannel, message }: MessageProps) {
    // user
    const { user } = useUserContext();

    return (
        <div
            className={
                idSender === user?.id
                    ? 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'
                    : 'flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end'
            }
        >
            <article
                className={
                    idSender === user?.id
                        ? 'px-4 py-2 rounded-lg inline-block bg-gray-300 text-gray-600'
                        : 'px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white '
                }
                id="msg-0"
            >
                <div className="flr">
                </div>
            </article>
        </div>
    );
}
