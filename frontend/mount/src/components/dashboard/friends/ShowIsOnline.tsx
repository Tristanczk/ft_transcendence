import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../../context/WebsocketContext';

interface FriendsProps {
    userId: number;
    initStatus: boolean;
    playingStatus: boolean;
	text: boolean;
}

interface MessageUpdateStatus {
    idUser: number;
    type: string;
}

function ShowIsOnline({ userId, initStatus, playingStatus, text }: FriendsProps) {
    const socket = useContext(WebsocketContext);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (initStatus) {
            setIsConnected(true);
        }

        if (playingStatus) {
            setIsPlaying(true);
        }

        socket.on('updateStatus', (data: MessageUpdateStatus) => {
            if (data.idUser === userId) {
                if (data.type === 'leave') setIsConnected(false);
                else if (data.type === 'come') setIsConnected(true);
                else if (data.type === 'startPlaying') setIsPlaying(true);
                else if (data.type === 'endPlaying') setIsPlaying(false);
            }
        });

        return () => {
            socket.off('updateStatus');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return isConnected ? (
        isPlaying ? (text ? 
            (<span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs ml-4 font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
                <span className="w-2 h-2 mr-1 bg-orange-500 rounded-full"></span>
                Playing
            </span>)
			:
			(<svg width="20" height="20">
			<circle
				cx="8"
				cy="8"
				r="8"
				fill='#f47b3f'
			></circle>
		</svg>)
        ) : (text ? (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs ml-4 font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                Available
            </span>)
			:
			(<svg width="20" height="20">
			<circle
				cx="8"
				cy="8"
				r="8"
				fill='#4ade80'
			></circle>
		</svg>)
        )
    ) : (text ? (
        <span className="inline-flex items-center bg-red-100 text-red-800 text-xs ml-4 font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
            <span className="w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
            Unavailable
        </span>)
			:
			(<svg width="20" height="20">
			<circle
				cx="8"
				cy="8"
				r="8"
				fill='#f43f5e'
			></circle>
		</svg>)
    );
}

export default ShowIsOnline;

// '#f43f5e'