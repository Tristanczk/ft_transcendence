import { useEffect, useState } from 'react';
import { UserSimplified } from '../../../types';
import axios from 'axios';

interface Props {
    friend: UserSimplified;
}

function ImageFriend({ friend }: Props) {
    const [imgY, setImgY] = useState<any>();

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/users/img/${friend.id}`,
                    { params: { id: friend.id }, responseType: 'arraybuffer', withCredentials: true },
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
        fetchImg();
    }, []);

    return imgY ? (
        <>
            <img
                className="w-8 h-8 rounded-full"
                src={`data:image/png;base64,${imgY}`}
                alt={friend.nickname}
            />
        </>
    ) : (
        <>vide</>
    );
}

export default ImageFriend;
