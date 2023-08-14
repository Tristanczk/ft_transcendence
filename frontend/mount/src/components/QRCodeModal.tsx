import React from 'react';
import Modal from 'react-modal';
import InputField from './InputField';

interface Props {
    isOpen: boolean;
    modalId: string;
    qrCodeDataUrl: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onModalClose: () => void;
}

const QRCodeModal: React.FC<Props> = ({
    isOpen,
    modalId,
    qrCodeDataUrl,
    onChange,
    onModalClose,
}) => (
    <Modal id={modalId} isOpen={isOpen} onRequestClose={onModalClose}>
        <div className="relative w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Two-factor authentication
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide={modalId}
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
                <div className="p-6 space-y-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        Please scan the QR code below with Google Authenticator
                        to register the app on you account
                    </p>
                    <img src={qrCodeDataUrl} alt="QR Code" />
                </div>
                <form className="space-y-4 md:space-y-6" action="#">
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
                        <button
                            data-modal-hide={modalId}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={onModalClose}
                        >
                            Validate two-factor authentication
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Modal>
);

export default QRCodeModal;
