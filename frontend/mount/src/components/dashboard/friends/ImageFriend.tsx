import { useEffect, useState } from 'react';
import { useAuthAxios } from '../../../context/AuthAxiosContext';

interface Props {
    userId: number;
    textImg: string;
    size: number;
}

function ImageFriend({ userId, textImg, size }: Props) {
    const [imgY, setImgY] = useState<string | null>(null);
    const authAxios = useAuthAxios();
    const inputClassName = `w-${size} h-${size} rounded-full`;

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await authAxios.get(
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
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <img
            className={inputClassName}
            src={imgY ? `data:image/png;base64,${imgY}` : '/norminet.jpeg'}
            alt={textImg}
        />
    );
}

export default ImageFriend;
