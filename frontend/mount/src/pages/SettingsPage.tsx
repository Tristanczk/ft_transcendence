import React, { useEffect, useState } from 'react';
import ToggleButton from '../components/ToggleButton';
import Button from '../components/Button';
import axios from 'axios';
import QRCodeModal from '../components/QRCodeModal';
import { NAVBAR_HEIGHT } from '../constants';
import { set, useForm } from 'react-hook-form';
import ErrorsFormField from '../components/ErrorsFormField';
import { ModalInputs } from '../components/QRCodeModal';

interface Inputs {
    username: string;
    email: string;
}

const SettingsPage: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [isTwoFactorEnabledPrev, setIsTwoFactorEnabledPrev] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
    const [update, setUpdate] = useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Inputs>({ mode: 'onTouched', criteriaMode: 'all' });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3333/users/me',
                    { withCredentials: true },
                );
                setUserName(response.data.nickname);
                setEmail(response.data.email);
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

    useEffect(() => {
        if (update) {
            const timeoutId = setTimeout(() => {
                setUpdate(false);
            }, 3000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [update]);

    const handleTwoFactorToggle = () => {
        setIsTwoFactorEnabled((prev) => !prev);
    };

    const handleCodeCheck = (data: ModalInputs) => {
        console.log(data.validationCode);
    };

    const onSubmit = async (data: Inputs) => {
        try {
            if (
                isTwoFactorEnabled === true &&
                isTwoFactorEnabledPrev === false
            ) {
                const response = await axios.get(
                    'http://localhost:3333/users/init-2fa',
                    { withCredentials: true },
                );
                setQrCodeDataUrl(response.data.qrCode);
                setDisplayModal(true);
            } else {
                await axios.patch(
                    'http://localhost:3333/users',
                    {
                        nickname: data.username,
                        email: data.email,
                        twoFactorAuthentication: isTwoFactorEnabled,
                    },
                    { withCredentials: true },
                );
                setUpdate(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div
                className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
            >
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Update settings
                        </h1>
                        {update && (
                            <p className="error mt-2 text-sm font-bold text-green-700 dark:text-green-500">
                                Your settings have been successfully updated
                            </p>
                        )}
                        <form
                            className="space-y-4 md:space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <ErrorsFormField
                                control={control}
                                errors={errors}
                                hasError={!!errors.username}
                                controllerName="username"
                                label="Username"
                                placeholder={userName}
                                rules={{
                                    minLength: {
                                        value: 3,
                                        message:
                                            'Username must be at least 3 characters long',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]+$/,
                                        message:
                                            'Username can only contain letters, numbers, and underscores',
                                    },
                                }}
                            />
                            <ErrorsFormField
                                control={control}
                                errors={errors}
                                hasError={!!errors.email}
                                controllerName="email"
                                label="Email"
                                placeholder={email}
                                rules={{
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email format',
                                    },
                                }}
                            />
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
                            <Button
                                disabled={Object.keys(errors).length > 0}
                                text="Save changes"
                                type="submit"
                            />
                        </form>
                        {displayModal ? (
                            <QRCodeModal
                                qrCodeDataUrl={qrCodeDataUrl}
                                modalId={'QRCode-modal'}
                                closeModal={() => setDisplayModal(false)}
                                onSubmit={handleCodeCheck}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SettingsPage;
