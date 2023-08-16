import axios from 'axios';
import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { on } from 'events';

interface Inputs {
    username: string;
    password: string;
}

const SignInPage: React.FC = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [error, setError] = useState<string>();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Inputs>();

    // const onSubmit = (data: Inputs) => {
    //     console.log(data);
    // };

    const onSubmit = async (data: Inputs) => {
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
            console.log(response);
            setIsLogged(true);
        } catch (error: any) {
            setError(error.response.data);
        }
        console.log(data);
    };

    const handleRedir42 = (event: React.FormEvent) => {
        event.preventDefault();
        window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin42&response_type=code`;
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    {isLogged && <div>Successfully signed in</div>}
                    {error && <div>Failed to sign in: {error}</div>}
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
                                        <label
                                            htmlFor="Username"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Username
                                        </label>
                                        <Controller
                                            name="username"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Username is required',
                                                minLength: {
                                                    value: 3,
                                                    message:
                                                        'Username must be at least 3 characters',
                                                },
                                                pattern: {
                                                    value: /^[a-zA-Z0-9_]+$/,
                                                    message:
                                                        'Username can only contain letters, numbers, and underscores',
                                                },
                                            }}
                                            render={({ field }) => (
                                                <div>
                                                    <InputField
                                                        {...field}
                                                        id="username"
                                                        placeholder="Username"
                                                        required={true}
                                                        type="text"
                                                    />
                                                    <div className="error">
                                                        {
                                                            errors.username
                                                                ?.message
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Password
                                        </label>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{
                                                required:
                                                    'Password is required',
                                            }}
                                            render={({ field }) => (
                                                <div>
                                                    <InputField
                                                        {...field}
                                                        id="password"
                                                        placeholder="Password"
                                                        required={true}
                                                        type="password"
                                                    />
                                                    <div className="error">
                                                        {
                                                            errors.password
                                                                ?.message
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        text="Signin with username"
                                        type="submit"
                                    ></Button>
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
