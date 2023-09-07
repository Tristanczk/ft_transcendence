import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthAxios } from '../context/AuthAxiosContext';
import { useUserContext } from '../context/UserContext';
import NotConnected from '../components/NotConnected';

const SignOutPage: React.FC = () => {
    const [message, setMessage] = useState('Not logged in');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const { logoutUser } = useUserContext();
    const authAxios = useAuthAxios();

    useEffect(() => {
        const signOut = async () => {
            try {
                const response = await authAxios.get('/auth/signout', {
                    withCredentials: true,
                });
                setMessage(response.data);
                logoutUser();
                navigate('/signin');
            } catch (error: any) {
                setError(true);
                setMessage(error.response.data.message);
            }
        };
        signOut();
    }, [navigate, logoutUser, authAxios]);

    if (error) {
        return <NotConnected message="Please signup or log in" />;
    } else {
        return <div>{message}</div>;
    }
};

export default SignOutPage;
