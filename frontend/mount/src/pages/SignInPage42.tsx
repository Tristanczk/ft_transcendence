import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInPage42: React.FC = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (!code) {
            console.error('No authorization code found');
            setMessage('No authorization code found');
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/signin/42',
                    { params: { code }, withCredentials: true },
                );
                setMessage(response.data);
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [location.search, navigate]);

    return <div>{message}</div>;
};

export default SignInPage42;
