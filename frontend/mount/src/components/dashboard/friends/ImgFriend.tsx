import { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
    userId: number;
    textImg?: string;
    size?: number;
    customClassName?: string;
}

function ImageFriend({ userId, textImg, size, customClassName }: Props) {
    const [imgY, setImgY] = useState<any>();
    const inputClassName = customClassName ?  customClassName : `w-${size} h-${size} rounded-full`;

    useEffect(() => {
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const fetchImg = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3333/users/img/${userId}`,
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
            return response.data;
        } catch (error) {
            console.error(error);
        }
    };

    return imgY ? (
        <>
            <img
                className={inputClassName}
                src={`data:image/png;base64,${imgY}`}
                alt={textImg}
            />
        </>
    ) : (
        <>vide</>
    );
}

export default ImageFriend;
