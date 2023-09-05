import axios from 'axios';
import { useEffect, useState } from 'react';

function TestGet() {
    const [data, setData] = useState<any>();

    useEffect(() => {
        async function doMe() {
            try {
                const response = await axios.get(
                    `http://localhost:3333/stats/testget/`,
                    {
                        withCredentials: true,
                    },
                );
                setData(response.data);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }
        doMe();
    }, []);

    return <></>;
}

export default TestGet;
