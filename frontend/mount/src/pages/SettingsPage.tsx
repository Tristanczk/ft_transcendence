import React, { useEffect, useState } from 'react';
import ToggleButton from '../components/Auth/ToggleButton';
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import ErrorsFormField from '../components/Auth/ErrorsFormField';
import TwoFactorModal, { ModalInputs } from '../components/Auth/TwoFactorModal';
import { useAuthAxios } from '../context/AuthAxiosContext';
import { useUserContext } from '../context/UserContext';
import AvatarUploader from '../components/user/AvatarUpload';
import NotConnected from '../components/NotConnected';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../shared/misc';
import TristanSection from '../components/TristanSection';

interface Inputs {
    username: string;
    email: string;
}

const SettingsPage: React.FC = () => {
    const { user, updateUser } = useUserContext();
    const [displayModal, setDisplayModal] = useState(false);
    const [displayDisableModal, setDisplayDisableModal] = useState(false);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | undefined>();
    const [twoFactorSecret, setTwoFactorSecret] = useState<
        string | undefined
    >();
    const [update, setUpdate] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [errorEdit, setErrorEdit] = useState<string | undefined>();
    const [twoFactor, setTwoFactor] = useState<string | undefined>();
    const authAxios = useAuthAxios();

    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
        user ? user.twoFactorAuthentication : false,
    );

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Inputs>({ mode: 'onTouched', criteriaMode: 'all' });

    useEffect(() => {
        if (user) {
            setIsTwoFactorEnabled(user.twoFactorAuthentication);
        }
    }, [user]);

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

    useEffect(() => {
        if (twoFactor) {
            const timeoutId = setTimeout(() => {
                setTwoFactor(undefined);
            }, 3000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [twoFactor]);

    const handleTwoFactorToggle = () => {
        setIsTwoFactorEnabled((prev) => !prev);
    };

    const enableTwoFactor = async (data: ModalInputs) => {
        try {
            await authAxios.post(
                '/users/enable-2fa',
                {
                    code: data.validationCode,
                },
                { withCredentials: true },
            );
            setDisplayModal(false);
            setTwoFactor('enabled');
            setError(undefined);
            updateUser({ twoFactorAuthentication: true });
        } catch (error: any) {
            setError(error.response.data);
        }
    };

    const disableTwoFactor = async (data: ModalInputs) => {
        try {
            await authAxios.post(
                '/users/disable-2fa',
                {
                    code: data.validationCode,
                },
                { withCredentials: true },
            );
            setDisplayDisableModal(false);
            setTwoFactor('disabled');
            setError(undefined);
            updateUser({ twoFactorAuthentication: false });
        } catch (error: any) {
            setError(error.response.data);
        }
    };

    const onSubmit = async (data: Inputs) => {
        try {
            await authAxios.patch(
                '/users',
                {
                    nickname: data.username,
                    email: data.email,
                },
                { withCredentials: true },
            );
            if (
                isTwoFactorEnabled === true &&
                user?.twoFactorAuthentication === false
            ) {
                const response = await authAxios.get('/users/init-2fa', {
                    withCredentials: true,
                });
                setQrCodeDataUrl(response.data.qrCode);
                setTwoFactorSecret(response.data.secret);
                setDisplayModal(true);
            } else if (
                isTwoFactorEnabled === false &&
                user?.twoFactorAuthentication === true
            ) {
                setDisplayDisableModal(true);
            }
            !data.username && (data.username = user?.nickname || '');
            !data.email && (data.email = user?.email || '');
            updateUser({ nickname: data.username, email: data.email });
            setUpdate(true);
        } catch (error: any) {
            setErrorEdit(error.response.data);
        }
    };

    return user ? (
        <TristanSection>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Update settings
            </h1>
            {update && (
                <p className="error mt-2 text-sm font-bold text-green-700 dark:text-green-500">
                    Your settings have been successfully updated
                </p>
            )}
            {twoFactor && (
                <p className="error mt-2 text-sm font-bold text-green-700 dark:text-green-500">
                    Two-factor authentication has been successfully {twoFactor}
                </p>
            )}
            {errorEdit && (
                <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                    Failed to update information: {errorEdit}
                </p>
            )}
            <AvatarUploader />
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
                    placeholder={user ? user.nickname : ''}
                    rules={{
                        minLength: {
                            value: USERNAME_MIN_LENGTH,
                            message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`,
                        },
                        maxLength: {
                            value: USERNAME_MAX_LENGTH,
                            message: `Username must be at most ${USERNAME_MAX_LENGTH} characters long`,
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
                    placeholder={user ? user.email : ''}
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
                <TwoFactorModal
                    title="Enable two-factor authentication"
                    qrCodeDataUrl={qrCodeDataUrl}
                    secret={twoFactorSecret}
                    modalId={'Enable-2fa-modal'}
                    closeModal={() => setDisplayModal(false)}
                    onSubmit={enableTwoFactor}
                    error={error}
                />
            ) : null}
            {displayDisableModal ? (
                <TwoFactorModal
                    title="Disable two-factor authentication"
                    modalId={'Disable-2fa-modal'}
                    closeModal={() => setDisplayDisableModal(false)}
                    onSubmit={disableTwoFactor}
                    error={error}
                />
            ) : null}
        </TristanSection>
    ) : (
        <NotConnected message="Please signup or log in to access your settings" />
    );
};

export default SettingsPage;
