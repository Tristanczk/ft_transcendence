import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../../context/WebsocketContext';

interface FriendsProps {
    userId: number;
    initStatus: boolean;
}

interface MessageUpdateStatus {
    idUser: number;
    type: string;
}

function ShowIsOnline({ userId, initStatus }: FriendsProps) {
    const socket = useContext(WebsocketContext);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (initStatus) {
            setIsConnected(true);
        }

        socket.on('updateStatus', (data: MessageUpdateStatus) => {
            if (data.idUser === userId) {
                data.type === 'leave'
                    ? setIsConnected(false)
                    : setIsConnected(true);
            }
        });

        return () => {
            socket.off('updateStatus');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isConnected ? (
        <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
            Available
        </span>
    ) : (
        <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
            Unavailable
        </span>
    );
}

export default ShowIsOnline;
