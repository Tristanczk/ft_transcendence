import { useContext, useEffect } from 'react';
import { WebsocketContext } from '../context/WebsocketContext';
import { useUserContext } from '../context/UserContext';

function TrackingOnline() {
    const socket = useContext(WebsocketContext);
    const { user } = useUserContext();

    let userId = -1;
    if (user) userId = user.id;

    const userObj = {
        id: userId,
        idConnection: socket.id,
    };

    useEffect(() => {
        const interval = setInterval(() => {
            socket.emit('ping', userObj.id);
        }, 2000);

        return () => {
            socket.off('ping');
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return <></>;
}

export default TrackingOnline;
