import axios from 'axios';
import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../constants';
import { ErrorMessage } from '@hookform/error-message';

interface Inputs {
    username: string;
    password: string;
}

const SignInPage: React.FC = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Inputs>({ mode: 'onTouched', criteriaMode: 'all' });

    const onSubmit = async (data: Inputs) => {
        setError(undefined);
        try {
            await axios.post(
                'http://localhost:3333/auth/signin',
                {
                    nickname: data.username,
                    password: data.password,
                },
                { withCredentials: true },
            );
            setIsLogged(true);
            navigate('/');
        } catch (error: any) {
            setError(error.response.data);
        }
    };

    const handleRedir42 = (event: React.FormEvent) => {
        event.preventDefault();
        window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin42&response_type=code`;
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div
                    className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                    style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
                >
                    {isLogged && <div>Successfully signed in</div>}
                    {!isLogged && (
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1>
                                <form
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <div>
                                        <Controller
                                            name="username"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Username is required',
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
                                            render={({ field }) => (
                                                <div>
                                                    <label
                                                        htmlFor="Username"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Username
                                                    </label>
                                                    <InputField
                                                        {...field}
                                                        id="username"
                                                        placeholder="Username"
                                                        type="text"
                                                        hasError={
                                                            errors.username
                                                                ? true
                                                                : false
                                                        }
                                                        onBlur={field.onBlur}
                                                    />
                                                    <ErrorMessage
                                                        errors={errors}
                                                        name="username"
                                                        render={({
                                                            messages,
                                                        }) =>
                                                            messages &&
                                                            Object.entries(
                                                                messages,
                                                            ).map(
                                                                ([
                                                                    type,
                                                                    message,
                                                                ]) => (
                                                                    <p
                                                                        className="error mt-1 text-sm text-red-600 dark:text-red-500"
                                                                        style={{
                                                                            fontSize:
                                                                                '12px',
                                                                        }}
                                                                        key={
                                                                            type
                                                                        }
                                                                    >
                                                                        {
                                                                            message
                                                                        }
                                                                    </p>
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Password is required',
                                            }}
                                            render={({ field }) => (
                                                <div>
                                                    <label
                                                        htmlFor="password"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Password
                                                    </label>
                                                    <InputField
                                                        {...field}
                                                        id="password"
                                                        placeholder="Password"
                                                        type="password"
                                                        hasError={
                                                            errors.password
                                                                ? true
                                                                : false
                                                        }
                                                        onBlur={field.onBlur}
                                                    />
                                                    <p
                                                        className="error mt-1 text-sm text-red-600 dark:text-red-500"
                                                        style={{
                                                            fontSize: '12px',
                                                        }}
                                                    >
                                                        {
                                                            errors.password
                                                                ?.message
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        text="Signin with username"
                                        type="submit"
                                    ></Button>
                                </form>
                                {error && (
                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
                                        Failed to sign in: {error}
                                    </p>
                                )}
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?{' '}
                                    <a
                                        href="/signup"
                                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        Sign up
                                    </a>
                                </p>
                                <Button
                                    text="Signin with 42"
                                    onClick={handleRedir42}
                                ></Button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default SignInPage;
