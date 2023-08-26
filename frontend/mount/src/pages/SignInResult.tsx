import React from 'react';
import { useLocation } from 'react-router-dom';
import GetUser from '../components/user/getUser';

const SignInResult: React.FC = () => {
    const location = useLocation();

    const result = new URLSearchParams(location.search).get('result');

    if (!result) {
        return <div>Something went wrong</div>;
    } else if (result === 'success_signin') {
        return <div>Sign in success</div>;
    } else if (result === 'success_signup') {
        return <div>Sign up success</div>;
    } else if (result === 'failure_signup_different_password') {
        return <div>Sign up failed: passwords don't match</div>;
    } else if (result === 'failure_signup') {
        return <div>Sign up failed</div>;
    } else if (result === 'failure_signin') {
        return <div>Sign in failed</div>;
    } else {
        return <div>Unknown sign in / sign up status</div>;
    }
};

export default SignInResult;
