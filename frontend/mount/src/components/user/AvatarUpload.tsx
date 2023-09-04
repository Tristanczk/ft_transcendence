import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import { useAuthAxios } from '../../context/AuthAxiosContext';
import ImageFriend from '../dashboard/friends/ImageFriend';

function AvatarUploader() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [img, setImg] = useState<string>();
    const { user } = useUserContext();
    const authAxios = useAuthAxios();

    useEffect(() => {
        const fetchImg = async () => {
            try {
                const response = await authAxios.get(
                    `http://localhost:3333/users/img/${user?.id}`,
                    {
                        params: { id: user?.id },
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
                setImg(base64Image);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        };
        fetchImg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = e.target.files?.[0];

        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }

        // console.log(selectedImage)
        if (selectedImage) {
            let formData = new FormData();

            formData.append('image', selectedImage);

            try {
                // console.log('try send photo')
                const response = await axios.post(
                    `http://localhost:3333/users/avatar`,
                    formData,
                    { withCredentials: true },
                );

                // console.log(response)
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <img
                className="w-24 h-24 rounded"
                src={`data:image/png;base64,${img}`}
                alt="avatar"
            />
            <label
                style={{
                    position: 'absolute',
                    top: 80,
                    left: 0,
                    width: 96,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)', // Transparency
                    color: 'white', // Text color
                    cursor: 'pointer', // Make it look clickable
                }}
                className="w-24 h-24 rounded"
            >
                Choose File
                <input
                    type="file"
                    accept="image/*"
                    style={{
                        display: 'none', // Hide the default input
                    }}
                    onChange={handleImageChange}
                />
            </label>
        </div>
    );
}

export default AvatarUploader;
