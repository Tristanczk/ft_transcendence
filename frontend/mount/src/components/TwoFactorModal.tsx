import React from 'react';
import Button from './Button';
import { useForm } from 'react-hook-form';
import ErrorsFormField from './ErrorsFormField';

interface Props {
    error?: string | undefined;
    modalId: string;
    qrCodeDataUrl: string | undefined;
    title: string;
    closeModal: () => void;
    onSubmit: (data: ModalInputs) => void;
}

export type ModalInputs = {
    validationCode: number;
};

const TwoFactorModal: React.FC<Props> = ({
    error = undefined,
    modalId,
    qrCodeDataUrl,
    title,
    closeModal,
    onSubmit,
}) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ModalInputs>({ mode: 'onTouched', criteriaMode: 'all' });

    return (
        <>
            <div
                id={modalId}
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-full max-w-lg max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5 space-y-2">
                        <div className="flex items-center justify-between border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={closeModal}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {qrCodeDataUrl && (
                            <div className="space-y-4">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Please scan the QR code below with Google
                                    Authenticator to register the app on you
                                    account
                                </p>
                                <img src={qrCodeDataUrl} alt="QR Code" />
                            </div>
                        )}
                        <form
                            className="space-y-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <ErrorsFormField
                                control={control}
                                errors={errors}
                                hasError={!!errors.validationCode}
                                controllerName="validationCode"
                                label="Please enter the code displayed
                                on GoogleAuthenticator"
                                placeholder="000 000"
                                rules={{
                                    required: 'Validation code is required',
                                    minLength: {
                                        value: 6,
                                        message:
                                            'Validation code must be 6 characters long',
                                    },
                                    maxLength: {
                                        value: 6,
                                        message:
                                            'Validation code must be 6 characters long',
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message:
                                            'Validation code must contain only digits',
                                    },
                                }}
                            />
                            {error && (
                                <p className="error mt-2 text-sm font-bold text-red-600 dark:text-red-500">
                                    {qrCodeDataUrl
                                        ? 'Impossible to enable two factor authentication: '
                                        : 'Impossible to disable two factor authentication: '}
                                    {error}
                                </p>
                            )}
                            <Button
                                disabled={Object.keys(errors).length > 0}
                                text={
                                    qrCodeDataUrl
                                        ? 'Enable two-factor authentication'
                                        : 'Disable two-factor authentication'
                                }
                                type="submit"
                            ></Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
};

export default TwoFactorModal;
