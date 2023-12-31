import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../../../context/UserContext';

interface Props {
    userId: number;
    textImg?: string;
    size?: number;
    customClassName?: string;
}

function ImageFriend({ userId, textImg, size, customClassName }: Props) {
    const [imgY, setImgY] = useState<string | null>(null);
    const inputClassName = customClassName
        ? customClassName
        : `w-${size} h-${size} rounded-full`;
    const { user } = useUserContext();

    useEffect(() => {
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, user]);

    const fetchImg = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/img/${userId}`,
                {
                    params: { id: userId },
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
            setImgY(base64Image);
        } catch {
            setImgY(null);
        }
    };

    return (
        <img
            className={inputClassName}
            src={imgY ? `data:image/png;base64,${imgY}` : '/norminet.jpeg'}
            alt={textImg}
        />
    );
}

export default ImageFriend;
