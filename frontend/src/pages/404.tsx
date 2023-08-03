import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

const goBack = (navigate: NavigateFunction) => {
    if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
    } else {
        navigate('/');
    }
};

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-gray-900">
            <div className="container mx-auto min-h-screen px-6 py-12 lg:flex lg:items-center lg:gap-12 max-w-4xl">
                <div className="w-full lg:w-1/2 text-center">
                    <p className="text-sm font-medium text-blue-400">
                        404 error
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                        Page not found
                    </h1>
                    <p className="mt-4 text-gray-400">
                        You seem to be lost. Here are some helpful links.
                    </p>
                    <div className="flex items-center mt-6 gap-x-3 justify-center">
                        <Button
                            text="← Go back"
                            onClick={() => goBack(navigate)}
                        />
                        <Button
                            text="Take me home"
                            onClick={() => navigate('/')}
                        />
                    </div>
                </div>
                <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0 text-center flex justify-center items-center">
                    <img
                        className="w-full max-w-lg lg:mx-auto"
                        src="https://merakiui.com/images/components/illustration.svg"
                        alt=""
                    />
                </div>
            </div>
        </section>
    );
};

export default NotFound;
