import axios from 'axios';
import { useEffect } from 'react';
import { User } from '../../types';

interface Props {
    user: User | null;
    setUser: any;
}
function GetUser({ user, setUser }: Props) {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    { withCredentials: true },
                );
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<></>);
}

export default GetUser;
