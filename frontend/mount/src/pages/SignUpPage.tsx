import axios from 'axios';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { NAVBAR_HEIGHT } from '../constants';
import { Controller, useForm } from 'react-hook-form';

interface Inputs {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpPage: React.FC = () => {
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<Inputs>({ mode: 'onTouched' });

    const passwordInput = watch('password');

    const onSubmit = async (data: Inputs) => {
        try {
            const response = await axios.post(
                'http://localhost:3333/auth/signup',
                {
                    nickname: data.username,
                    email: data.email,
                    password: data.password,
                },
                { withCredentials: true },
            );
            console.log(response.data);
            navigate('/signin/result?result=success_signup');
        } catch (error) {
            console.error(error);
            navigate('/signin/result?result=failure_signup');
        }
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
                                                        onBlur={field.onBlur}
                                                    />
                                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
                                                        {
                                                            errors.username
                                                                ?.message
                                                        }
                                                    </p>
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
                                                    message:
                                                        'Invalid email format',
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
                                                        onBlur={field.onBlur}
                                                    />
                                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
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
                                                required:
                                                    'Password is required',
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
                                                        onBlur={field.onBlur}
                                                    />
                                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
                                                        {
                                                            errors.password
                                                                ?.message
                                                        }
                                                    </p>
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
                                                        value ===
                                                            passwordInput ||
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
                                                        onBlur={field.onBlur}
                                                    />
                                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
                                                        {
                                                            errors
                                                                .confirmPassword
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
                                {/* {error && (
                                    <p className="error mt-2 text-sm text-red-600 dark:text-red-500">
                                        Failed to sign in: {error}
                                    </p>
                                )} */}
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
                    )}
                </div>
            </section>
        </>
        // <section className="bg-gray-50 dark:bg-gray-900">
        //     <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        //         <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        //             <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        //                 <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        //                     Create an account
        //                 </h1>
        //                 <form className="space-y-4 md:space-y-6" action="#">
        //                     <div>
        //                         <label
        //                             htmlFor="Username"
        //                             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        //                         >
        //                             Username
        //                         </label>
        //                         <InputField
        //                             id="username"
        //                             placeholder={userName}
        //                             required={true}
        //                             type="username"
        //                             onChange={handleUserNameChange}
        //                         ></InputField>
        //                     </div>
        //                     <div>
        //                         <label
        //                             htmlFor="Email"
        //                             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        //                         >
        //                             Email
        //                         </label>
        //                         <InputField
        //                             id="email"
        //                             placeholder={email}
        //                             required={true}
        //                             type="email"
        //                             onChange={handleEmailChange}
        //                         ></InputField>
        //                     </div>
        //                     <div>
        //                         <label
        //                             htmlFor="password"
        //                             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        //                         >
        //                             Password
        //                         </label>
        //                         <InputField
        //                             id="password"
        //                             placeholder={password}
        //                             required={true}
        //                             type="password"
        //                             onChange={handlePasswordChange}
        //                         ></InputField>
        //                     </div>
        //                     <div>
        //                         <label
        //                             htmlFor="password"
        //                             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        //                         >
        //                             Confirm password
        //                         </label>
        //                         <InputField
        //                             id="confirm-password"
        //                             placeholder={confirmPassword}
        //                             required={true}
        //                             type="password"
        //                             onChange={handleConfirmPasswordChange}
        //                         ></InputField>
        //                     </div>
        //                     <Button
        //                         text="Create your account"
        //                         onClick={handleSubmit}
        //                     ></Button>
        //                     <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        //                         Already have an account?{' '}
        //                         <a
        //                             href="/signin"
        //                             className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        //                         >
        //                             Sign in here
        //                         </a>
        //                     </p>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </section>
    );
};

export default SignUpPage;
