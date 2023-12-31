import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TwoFactorForm from '../components/Auth/TwoFactorForm';
import { useUserContext } from '../context/UserContext';
import { NAVBAR_HEIGHT } from '../shared/misc';
import AlreadyConnected from '../components/AlreadyConnected';

const SignInPage42: React.FC = () => {
    const location = useLocation();
    const [error, setError] = useState<string>();
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();
    const { user, loginUser } = useUserContext();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');

        if (!code) {
            setError('No authorization code found');
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signin/42`,
                    { params: { code }, withCredentials: true },
                );
                if (response.data.user.twoFactorAuthentication) {
                    setUsername(response.data.user.nickname);
                    setTwoFactor(true);
                } else {
                    loginUser(response.data.user);
                    navigate('/');
                }
            } catch (error: any) {
                setError(error.response.data);
            }
        };
        fetchUser();
    }, [location.search, navigate, loginUser]);

    useEffect(() => {
        if (error) {
            const timeoutId = setTimeout(() => {
                navigate('/signin');
            }, 3000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [error, navigate]);

    return user ? (
        <AlreadyConnected />
    ) : (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div
                className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
            >
                {twoFactor && (
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <TwoFactorForm username={username} />
                    </div>
                )}
                {error && (
                    <>
                        <div className="dot-flashing"></div>
                        <div className="text-black mt-4">
                            {error}. You will be redirected shortly.
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default SignInPage42;
