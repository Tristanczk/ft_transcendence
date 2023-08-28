import axios from "axios";
import { useEffect } from "react";

function TestUpdate() {
	
	useEffect(() => {
		async function doMe() {
			const nb = 5;

			try {
				const response = await axios.put(
					`http://localhost:3333/games/${nb}`,
					{
						scoreA: 8,
						scoreB: 4,
						won: true,
					},
					{
						withCredentials: true,
					},
				);
				console.log(response)
				return response;
			} catch (error) {
				console.error(error);
			}
		};
		doMe()
	}, [])
	

	return (<></>);
}

export default TestUpdate