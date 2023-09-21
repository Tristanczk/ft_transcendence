import axios from 'axios';
import { useEffect } from 'react';

function TestInsert() {
    useEffect(() => {
        async function doMe() {
            try {
                const response = await axios.post(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/games/init/`,
                    {
                        idPlayerB: 2,
                    },
                    {
                        withCredentials: true,
                    },
                );
                console.log(response);
                return response;
            } catch {}
        }
        doMe();
    }, []);

    return <></>;
}

export default TestInsert;
