import axios from 'axios';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../constants';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

interface Inputs {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<Inputs>({ mode: 'onTouched', criteriaMode: 'all' });

    const passwordInput = watch('password');

    const onSubmit = async (data: Inputs) => {
        try {
            await axios.post(
                'http://localhost:3333/auth/signup',
                {
                    nickname: data.username,
                    email: data.email,
                    password: data.password,
                },
                { withCredentials: true },
            );
            navigate('/');
        } catch (error: any) {
            setError(error.response.data);
        }
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div
                    className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"
                    style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
                >
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            {error && (
                                <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                                    Failed to sign up: {error}
                                </p>
                            )}
                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div>
                                    <Controller
                                        name="username"
                                        control={control}
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
                                                    render={({ messages }) =>
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
                                                                    key={type}
                                                                >
                                                                    {message}
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
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Invalid email format',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Email
                                                </label>
                                                <InputField
                                                    {...field}
                                                    id="email"
                                                    placeholder="Email"
                                                    type="text"
                                                    hasError={
                                                        errors.email
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
                                                    {errors.email?.message}
                                                </p>
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message:
                                                    'Password must be at least 8 characters long',
                                            },
                                            validate: {
                                                uppercase: (value) =>
                                                    /[A-Z]/.test(value) ||
                                                    'Password must contain at least one uppercase character',
                                                lowercase: (value) =>
                                                    /[a-z]/.test(value) ||
                                                    'Password must contain at least one lowercase character',
                                                digit: (value) =>
                                                    /\d/.test(value) ||
                                                    'Password must contain at least one digit',
                                            },
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
                                                <ErrorMessage
                                                    errors={errors}
                                                    name="password"
                                                    render={({ messages }) =>
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
                                                                    key={type}
                                                                >
                                                                    {message}
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
                                        name="confirmPassword"
                                        control={control}
                                        rules={{
                                            required:
                                                'Password confirmation is required',
                                            validate: {
                                                matchesPreviousPassword: (
                                                    value,
                                                ) =>
                                                    value === passwordInput ||
                                                    'Passwords must match',
                                            },
                                        }}
                                        render={({ field }) => (
                                            <div>
                                                <label
                                                    htmlFor="confirmPassword"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Confirm password
                                                </label>
                                                <InputField
                                                    {...field}
                                                    id="confirmPassword"
                                                    placeholder="Password"
                                                    type="password"
                                                    hasError={
                                                        errors.confirmPassword
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
                                                        errors.confirmPassword
                                                            ?.message
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    />
                                </div>
                                <Button
                                    text="Create your account"
                                    type="submit"
                                ></Button>
                            </form>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account?{' '}
                                <a
                                    href="/signin"
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUpPage;
