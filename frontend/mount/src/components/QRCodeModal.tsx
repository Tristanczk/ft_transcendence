import React from 'react';
import Modal from 'react-modal';
import InputField from './InputField';
import Button from './Button';

interface Props {
    modalId: string;
    qrCodeDataUrl: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    closeModal: () => void;
    validationFunction: () => void;
}

const QRCodeModal: React.FC<Props> = ({
    modalId,
    qrCodeDataUrl,
    closeModal,
    onChange,
    validationFunction,
}) => (
    <>
        <div
            id={modalId}
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
            <div className="relative w-full max-w-lg max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5 space-y-2">
                    <div className="flex items-center justify-between border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Two-factor authentication
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
                    <div className="space-y-4">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Please scan the QR code below with Google
                            Authenticator to register the app on you account
                        </p>
                        <img src={qrCodeDataUrl} alt="QR Code" />
                    </div>
                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="prompt"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Please enter the validation code displayed on
                                GoogleAuthenticator
                            </label>
                            <InputField
                                id="confirmation-prompt"
                                placeholder=""
                                required={true}
                                type="confirmation-prompt"
                                onChange={onChange}
                            ></InputField>
                        </div>
                        <Button
                            text="Validate two-factor authentication"
                            onClick={validationFunction}
                        ></Button>
                    </form>
                </div>
            </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
);

export default QRCodeModal;
