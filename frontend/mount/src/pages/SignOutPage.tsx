import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignOutPage: React.FC = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const signOut = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/signout',
                    { withCredentials: true },
                );
                setMessage(response.data);
                navigate('/signin');
            } catch (error: any) {
                console.error(error);
                setError(true);
                setMessage(error.response.data);
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
