import React from 'react';
import axios from 'axios';
import Button from './Button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorsFormField from './ErrorsFormField';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

interface LoginInputs {
    username: string;
    password: string;
}

interface Props {
    setUsername: (username: string) => void;
    setTwoFactor: (twoFactor: boolean) => void;
}

const LoginForm: React.FC<Props> = ({ setUsername, setTwoFactor }) => {
    const [error, setError] = useState<string>();
    const { loginUser } = useUserContext();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginInputs>({ mode: 'onTouched', criteriaMode: 'all' });
    const navigate = useNavigate();

    const onSubmit = async (data: LoginInputs) => {
        setError(undefined);
        try {
            const response = await axios.post(
                'http://localhost:3333/auth/signin',
                {
                    nickname: data.username,
                    password: data.password,
                },
                { withCredentials: true },
            );
            console.log('response', response.data);
            if (response.data.user.twoFactorAuthentication) {
                setTwoFactor(true);
                setUsername(data.username);
            } else {
                loginUser(response.data.user);
                navigate('/');
            }
        } catch (error: any) {
            setError(error.response.data);
        }
    };

    const handleRedir42 = (event: React.FormEvent) => {
        event.preventDefault();
        window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin42&response_type=code`;
    };

    return (
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
            </h1>
            {error && (
                <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                    Failed to sign in: {error}
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
                    placeholder="Username"
                    rules={{
                        required: 'Username is required',
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
                    hasError={!!errors.password}
                    controllerName="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    rules={{
                        required: 'Password is required',
                    }}
                />
                <Button
                    disabled={Object.keys(errors).length > 0}
                    text="Signin with username"
                    type="submit"
                />
            </form>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                    Sign up
                </a>
            </p>
            <Button text="Signin with 42" onClick={handleRedir42} />
        </div>
    );
};

export default LoginForm;
