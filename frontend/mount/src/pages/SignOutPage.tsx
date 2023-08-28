import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authAxios from 'axios';

const SignOutPage: React.FC = () => {
    const [message, setMessage] = useState('Not logged in');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const signOut = async () => {
            try {
                const response = await authAxios.get('/auth/signout', {
                    withCredentials: true,
                });
                setMessage(response.data);
                navigate('/signin');
            } catch (error: any) {
                console.error(error);
                setError(true);
                setMessage(error.response.data.message);
            }
        };
        signOut();
    }, [navigate]);

    if (error) {
        return <div>Sign out failed: {message}</div>;
    } else {
        return <div>{message}</div>;
    }
};

export default SignOutPage;
