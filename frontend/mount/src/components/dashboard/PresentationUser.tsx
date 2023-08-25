import axios from 'axios';
import { User } from '../../types';
import React, { useEffect, useState } from 'react';

interface PresentationUserProps {
    user: User;
}

function PresentationUser({ user }: PresentationUserProps) {
    const [imgY, setImgY] = useState<any>();

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/users/img/${user.id}`,
                    {
                        params: { id: user.id },
                        responseType: 'arraybuffer',
                        withCredentials: true,
                    },
                );
                const base64Image = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                const imageDataUrl = `data:image/png;base64,${base64Image}`;
                setImgY(imageDataUrl);
                return imageDataUrl;
            } catch (error) {
                console.error(error);
            }
        };
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dateAffiche = false;
    // const dateAffiche = user.createdAt && user.createdAt.getFullYear();

    return (
        <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <img
                        className="mr-4 w-16 h-16 rounded-full"
                        src={imgY}
                        alt={user.nickname}
                    />
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {user.nickname.charAt(0).toUpperCase() +
                                user.nickname.slice(1)}
                        </div>
                        <p className="text-base font-light text-gray-500 dark:text-gray-400">
                            Current ELO: {user.elo}
                        </p>
                        {dateAffiche && (
                            <p className="text-base font-light text-gray-500 dark:text-gray-400">
                                Member since {dateAffiche}
                            </p>
                        )}
                    </div>
                </div>
            </address>
        </header>
    );
}

export default PresentationUser;
