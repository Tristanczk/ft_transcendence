import Button from './Button';
import { useNavigate } from 'react-router-dom';

function NotConnected({ message }: { message: string }) {
    const navigate = useNavigate();
    return (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                        <h2 className="text-3xl font-extrabold dark:text-white">
                            Not connected...
                        </h2>
                        <p className="mt-4 mb-4">{message}</p>
                        <Button
                            text="Sign in"
                            onClick={() => {
                                navigate('/signin');
                            }}
                        />
                    </article>
                </div>
            </main>
        </>
    );
}

export default NotConnected;
