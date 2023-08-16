import React, { useEffect, useState } from 'react';
import ToggleButton from '../components/ToggleButton';
import Button from '../components/Button';
import InputField from '../components/InputField';
import axios from 'axios';
import QRCodeModal from '../components/QRCodeModal';

const SettingsPage: React.FC = () => {
    const [newUserName, setNewUserName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    // const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [isTwoFactorEnabledPrev, setIsTwoFactorEnabledPrev] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [validationCode, setvalidationCode] = useState('');

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

    const handleValidationCodeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setvalidationCode(event.target.value);
    };

    const handleCodeCheck = () => {
        console.log(validationCode);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (
                isTwoFactorEnabled === true &&
                isTwoFactorEnabledPrev === false
            ) {
                const response = await axios.post(
                    'http://localhost:3333/users/enable-2fa',
                    {},
                    { withCredentials: true },
                );
                setQrCodeDataUrl(response.data.qrCode);
                setDisplayModal(true);
            }
            const response = await axios.patch(
                'http://localhost:3333/users',
                {
                    nickname: newUserName,
                    email: newEmail,
                    twoFactorAuthentication: isTwoFactorEnabled,
                },
                { withCredentials: true },
            );

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form id="settings">
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
                        autocomplete="username"
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
                        autocomplete="email"
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
                        id="two_factor_authentication"
                    ></ToggleButton>
                </div>
                <Button text="Save changes" onClick={handleSubmit}></Button>
            </form>
            {displayModal ? (
                <QRCodeModal
                    qrCodeDataUrl={qrCodeDataUrl}
                    modalId={'QRCode-modal'}
                    closeModal={() => setDisplayModal(false)}
                    onChange={handleValidationCodeChange}
                    validationFunction={handleCodeCheck}
                />
            ) : null}
        </>
    );
};

export default SettingsPage;
