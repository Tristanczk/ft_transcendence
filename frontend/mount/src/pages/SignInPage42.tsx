import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SignInPage42: React.FC = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (!code) {
            console.error('No authorization code found');
            setError(true);
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/signin/42',
                    { params: { code }, withCredentials: true },
                );
                setMessage(response.data);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        };
        fetchUser();
    }, [location.search]);

    if (error) {
        return <div>Sign in failed</div>;
    } else {
        return <div>{message}</div>;
    }
};

export default SignInPage42;
