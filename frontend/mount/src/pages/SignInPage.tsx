import React, { useState } from 'react';
import TwoFactorForm from '../components/Auth/TwoFactorForm';
import LoginForm from '../components/Auth/LoginForm';
import TristanSection from '../components/TristanSection';
import AlreadyConnected from '../components/AlreadyConnected';
import { useUserContext } from '../context/UserContext';

const SignInPage: React.FC = () => {
    const [twoFactor, setTwoFactor] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const { user } = useUserContext();
    return user ? (
        <AlreadyConnected />
    ) : (
        <TristanSection>
            {twoFactor ? (
                <TwoFactorForm username={username} />
            ) : (
                <LoginForm
                    setUsername={setUsername}
                    setTwoFactor={setTwoFactor}
                />
            )}
        </TristanSection>
    );
};

export default SignInPage;
