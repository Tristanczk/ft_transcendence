import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../../context/WebsocketContext';
import { useUserContext } from '../../../context/UserContext';

interface FriendsProps {
    userId: number;
    initStatus: boolean;
    playingStatus: boolean;
}

interface MessageUpdateStatus {
    idUser: number;
    type: string;
}

function ButtonDefyPlayer({ userId, initStatus, playingStatus }: FriendsProps) {
    const socket = useContext(WebsocketContext);
	const { user } = useUserContext();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
	// const [play, setPlay] = useState<number>(-1)

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

	function playWithUser() {
		console.log(user?.id + ' defy ' + userId)
		socket.emit('defyUser', {idUserB: userId}, (response: any) => {
			if (response.error) {
				console.log(response.message)
			}
			else {
				console.log(response.message)
			}
		});
	}

    return user && user.id !== userId && isConnected === true && isPlaying === false ? (
        <button onClick={() => playWithUser()}>Defy</button>
    ) : (
        <></>
    );
}

export default ButtonDefyPlayer;
