import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../../context/WebsocketContext"


function Test() {
	const [value, setValue] = useState('');
	const socket = useContext(WebsocketContext);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('connected !');
		});
		socket.on('onMessage', (data) => {
			console.log('onMessage event received!');
			console.log(data);
		});

		return () => {
			socket.off('connect');
			socket.off('onMessage');
			console.log('unregister event');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = () => {
		socket.emit('newMessage', value);
		setValue('');
	}

	return (
		<div>
			<h1>Websocket component</h1>
			<input type='text' value={value} onChange={(e) => setValue(e.target.value)}/>
			<button onClick={onSubmit}>submit</button>
		</div>
	);
}

export default Test