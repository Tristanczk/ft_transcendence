const NoUser: React.FC<{ idUserToView: string | undefined }> = ({
    idUserToView,
}) => (
    <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                <h2 className="text-3xl font-extrabold dark:text-white">
                    No user found
                </h2>
                <p className="mt-4 mb-4">
                    {idUserToView && idUserToView.length > 0
                        ? `'${idUserToView}' cannot be found on our server.`
                        : 'No user id provided.'}
                </p>
            </article>
        </div>
    </main>
);

export default NoUser;
