import axios from 'axios';
import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:3333/auth/signin',
                { nickname: userName, password },
                { withCredentials: true },
            );
            console.log(response.data);
            navigate('/signin/result?result=success_signin');
        } catch (error) {
            console.error(error);
            navigate('/signin/result?result=failure_signin');
        }
    };

    const handleRedir42 = (event: React.FormEvent) => {
        event.preventDefault();
        window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.REACT_APP_API42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin42&response_type=code`;
    };

    const handleUserNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUserName(event.target.value);
    };

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label
                                    htmlFor="Username"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Username
                                </label>
                                <InputField
                                    id="username"
                                    placeholder={userName}
                                    required={true}
                                    type="username"
                                    onChange={handleUserNameChange}
                                ></InputField>
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <InputField
                                    id="password"
                                    placeholder={password}
                                    required={true}
                                    type="password"
                                    onChange={handlePasswordChange}
                                ></InputField>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            aria-describedby="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                            required={false}
                                        ></input>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label
                                            htmlFor="remember"
                                            className="text-gray-500 dark:text-gray-300"
                                        >
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button
                                text="Signin with username"
                                onClick={handleSubmit}
                            ></Button>
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
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInPage;
