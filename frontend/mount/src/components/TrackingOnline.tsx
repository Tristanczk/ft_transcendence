import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../context/WebsocketContext";
import axios from 'axios';


function TrackingOnline() {
	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);

	async function sendConnected() {
		const idUser = 2;
		try {
			const response = await axios.post(
				`http://localhost:3333/gateway/${idUser}`,
				{ id: idUser },
				{ withCredentials: true },
			);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const handleBeforeUnload = (e: any) => {
			e.preventDefault();
			e.returnValue = '';
			socket.emit('onLeave', 'userleft');
		};


		socket.on('onLeave', (data) => {});
	  
		socket.on('connect', () => {
			socket.emit('onArrive', 'welcome me');
		});

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			socket.off('connect');
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