import axios from 'axios';
import { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';

function GetUser() {
    const { loginUser, logoutUser } = useUserContext();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('try');
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    {
                        withCredentials: true,
                    },
                );
                loginUser(response.data);
            } catch (error) {
                logoutUser();
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <></>;
}

export default GetUser;
