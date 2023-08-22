import { useContext, useEffect, useState } from "react";
import { User } from "../../../types";
import { WebsocketContext } from "../../../context/WebsocketContext";

interface FriendsProps {
    userId: number;
}

function ShowIsOnline({ userId }: FriendsProps) {
	const socket = useContext(WebsocketContext);
	const [isConnected, setIsConnected] = useState<boolean>(false)

	useEffect(() => {
		const userObj = {
			id: userId,
			idConnection: socket.id,
		}
		socket.on('onLeave', (data) => {});

		return () => {
			socket.off('onLeave');
		};
	}, []);

	return isConnected ? (
		<>Online</>
	) : (
		<>Offline</>
	);
}

export default ShowIsOnline