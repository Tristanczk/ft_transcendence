import axios from "axios";
import { useEffect } from "react";

function TestInsert() {
	
	useEffect(() => {
		async function doMe() {
			try {
				const response = await axios.get(
					`http://localhost:3333/stats/test/`,
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

export default TestInsert