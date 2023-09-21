import Button from './Button';
import { useNavigate } from 'react-router-dom';

function AlreadyConnected() {
    const navigate = useNavigate();
    return (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <h2 className="text-3xl font-extrabold dark:text-white">
                            You are already signed in...
                        </h2>
                        <Button
                            text="Sign out"
                            onClick={() => {
                                navigate('/signout');
                            }}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}

export default AlreadyConnected;
