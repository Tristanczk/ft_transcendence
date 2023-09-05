import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';

function AvatarUploader() {
    const [imageUpdate, setImageUpdate] = useState<string | null>(null);
    const [img, setImg] = useState<string | null>();
    const { user, updateUser } = useUserContext();

    useEffect(() => {
        const fetchImg = async () => {
            if (!user) return;
            try {
                const response = await axios.get(
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
            } catch (error) {
                console.error(error);
            }
        };
        fetchImg();
    }, [user]);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = e.target.files?.[0];
        updateUser({ updateAvatar: false });
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUpdate(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }

        if (selectedImage) {
            let formData = new FormData();

            formData.append('image', selectedImage);

            try {
                await axios.post(
                    `http://localhost:3333/users/avatar`,
                    formData,
                    { withCredentials: true },
                );
                updateUser({ updateAvatar: true });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="relative w-32">
            {img && (
                <img
                    className="h-32 rounded"
                    src={
                        imageUpdate
                            ? imageUpdate
                            : `data:image/png;base64,${img}`
                    }
                    alt="avatar"
                />
            )}
            <label className="block text-sm font-semibold py-1 text-gray-900 dark:text-white absolute bottom-0 left-0 w-full text-center bg-white bg-opacity-60 cursor-pointer">
                Update avatar
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </label>
        </div>
    );
}

export default AvatarUploader;
