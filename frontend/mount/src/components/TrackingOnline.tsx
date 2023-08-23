import { useContext, useEffect, useRef, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext";
import axios from 'axios';
import { User } from "../types";

interface Props {
	user: User;
}
function TrackingOnline({user}: Props) {
	const [value, setValue] = useState('');
	const [connected, setConnected] = useState<boolean>(false);
	const socket = useContext(WebsocketContext);

	useEffect(() => {
		const userObj = {
			id: user.id,
			idConnection: socket.id,
		}

		const handleBeforeUnload = (e: any) => {
			e.preventDefault();
			e.returnValue = '';
			const userObj = {
				id: user.id,
				idConnection: socket.id,
			}
			socket.emit('onLeave', userObj);
		};


		socket.on('onLeave', (data) => {});
	  
		if (!connected){
			setConnected(true);
			console.log('got there');
            socket.emit('onArrive', userObj);
		}

		socket.on('connect', () => {
            socket.emit('onArrive', userObj);
			setConnected(true);
		});

		socket.on('close', () => {
            socket.emit('onLeave', userObj);
			setConnected(true);
		});

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			socket.off('connect');
			socket.off('close');
			socket.off('onLeave');
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	return (
		<div>
		</div>
	);
}

export default TrackingOnline


	// async function sendConnected() {
	// 	const idUser = 2;
	// 	try {
	// 		const response = await axios.post(
	// 			`http://localhost:3333/gateway/${idUser}`,
	// 			{ id: idUser },
	// 			{ withCredentials: true },
	// 		);
	// 		console.log(response.data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// }