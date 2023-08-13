import React, { useEffect, useState } from 'react';
import ToggleButton from '../components/ToggleButton';
import Button from '../components/Button';
import InputField from '../components/InputField';
import axios from 'axios';

const SettingsPage: React.FC = () => {
    const [newUserName, setNewUserName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    // const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [isTwoFactorEnabledPrev, setIsTwoFactorEnabledPrev] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    { withCredentials: true },
                );
                setNewUserName(response.data.nickname);
                setNewEmail(response.data.email);
                setIsTwoFactorEnabledPrev(
                    response.data.twoFactorAuthentication,
                );
                setIsTwoFactorEnabled(response.data.twoFactorAuthentication);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const handleUserNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setNewUserName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    };

    const handleTwoFactorToggle = () => {
        setIsTwoFactorEnabled((prev) => !prev);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.patch(
                'http://localhost:3333/users',
                {
                    nickname: newUserName,
                    email: newEmail,
                    twoFactorAuthentication: isTwoFactorEnabled,
                },
                { withCredentials: true },
            );
            if (
                isTwoFactorEnabled === true &&
                isTwoFactorEnabledPrev === false
            ) {
                const response = await axios.post(
                    'http://localhost:3333/users/enable-2fa',
                    {},
                    { withCredentials: true },
                );
                console.log(response.data);
            }
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form>
            <div className="mb-6">
                <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Username
                </label>
                <InputField
                    id="username"
                    placeholder={newUserName}
                    required={false}
                    type="username"
                    onChange={handleUserNameChange}
                ></InputField>
            </div>
            <div className="mb-6">
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Email
                </label>
                <InputField
                    id="email"
                    placeholder={newEmail}
                    required={false}
                    type="email"
                    onChange={handleEmailChange}
                ></InputField>
            </div>
            <div className="mb-6">
                <label
                    htmlFor="two_factor_authentication"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Two-Factor Authentication
                </label>
                <ToggleButton
                    checked={isTwoFactorEnabled}
                    onChange={handleTwoFactorToggle}
                ></ToggleButton>
            </div>
            <Button text="Save changes" onClick={handleSubmit}></Button>
        </form>
    );
};

export default SettingsPage;
