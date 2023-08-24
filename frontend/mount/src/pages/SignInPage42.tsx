import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NAVBAR_HEIGHT } from '../constants';
import TwoFactorForm from '../components/TwoFactorForm';

const SignInPage42: React.FC = () => {
    const location = useLocation();
    const [error, setError] = useState<string>();
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (!code) {
            setError('No authorization code found');
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/auth/signin/42',
                    { params: { code }, withCredentials: true },
                );
                console.log('response', response.data);
                if (response.data.user.twoFactorAuthentication) {
                    setUsername(response.data.user.nickname);
                    setTwoFactor(true);
                } else navigate('/');
            } catch (error: any) {
                setError(error.response.data);
            }
        };
        fetchUser();
    }, [location.search, navigate]);

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div
                className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
            >
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    {twoFactor && <TwoFactorForm username={username} />}
                    {error && <div>{error}</div>}
                </div>
            </div>
        </section>
    );
};

export default SignInPage42;
