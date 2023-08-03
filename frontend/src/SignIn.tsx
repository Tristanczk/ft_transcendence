import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SignIn: React.FC = () => {
    const location = useLocation();
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (!code) {
            console.error('No authorization code found');
            setError(true);
            return;
        }
        const fetchUser = async () => {
            const user = await axios.get('http://localhost:3333/auth/signin', {
                params: { code },
            });
            setAccessToken(user.data.accessToken);
            if (user.data.login !== '') {
                setAccessToken(user.data.accessToken);
            } else {
                setError(true);
            }
        };
        fetchUser();
    }, []);

    if (error) {
        return <div>Sign in failed</div>;
    } else {
        return <div>Successfully signed in! Welcome, {accessToken}</div>;
    }
};

export default SignIn;
