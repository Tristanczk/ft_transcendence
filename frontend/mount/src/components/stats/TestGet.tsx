import axios from 'axios';
import { useEffect, useState } from 'react';

function TestGet() {
    const [data, setData] = useState<any>();

    useEffect(() => {
        async function doMe() {
            try {
                const response = await axios.get(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/stats/testget/`,
                    {
                        withCredentials: true,
                    },
                );
                setData(response.data);
                return response.data;
            } catch {}
        }
        doMe();
    }, []);

    return <></>;
}

export default TestGet;
