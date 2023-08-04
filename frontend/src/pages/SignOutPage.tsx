import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SignOutPage: React.FC = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const signOut = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/signout',
                    { withCredentials: true },
                );
                setMessage(response.data);
            } catch (error) {
                console.error(error);
                setError(true);
            }
        };
        signOut();
    }, [location.search]);

    if (error) {
        return <div>Sign out failed</div>;
    } else {
        return <div>{message}</div>;
    }
};

export default SignOutPage;
