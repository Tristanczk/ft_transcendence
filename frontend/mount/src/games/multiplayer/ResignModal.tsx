import { Button, Modal } from 'flowbite-react';
import React from 'react';
import { Socket } from 'socket.io-client';

const ResignModal = ({
    openModal,
    setOpenModal,
    socket,
    gameId,
}: {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    socket: Socket;
    gameId: string | undefined;
}) => {
    return (
        <Modal
            show={openModal}
            size="md"
            popup
            onClose={() => setOpenModal(false)}
        >
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        You are about to resign, are you sure?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            color="failure"
                            onClick={() => {
                                setOpenModal(false);
                                socket.emit('quitGame', gameId);
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            color="gray"
                            onClick={() => setOpenModal(false)}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ResignModal;
