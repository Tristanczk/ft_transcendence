import React, { useState } from 'react';
import { NAVBAR_HEIGHT } from '../constants';
import TwoFactorForm from '../components/TwoFactorForm';
import LoginForm from '../components/LoginForm';

const SignInPage: React.FC = () => {
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div
                className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
            >
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    {twoFactor ? (
                        <TwoFactorForm username={username} />
                    ) : (
                        <LoginForm
                            setUsername={setUsername}
                            setTwoFactor={setTwoFactor}
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default SignInPage;
