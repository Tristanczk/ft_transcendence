
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

function AvatarUploader() {
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
	const selectedImage = e.target.files?.[0];

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);

    }

	console.log(selectedImage)
	if (selectedImage) {
		let formData = new FormData();
		
		formData.append("image", selectedImage);
		
		try {
			console.log('try send photo')
			const response = await axios.post(
				`http://localhost:3333/users/avatar`,
				formData,
				{ withCredentials: true },
			);
			
			console.log(response)
		} catch (error) {
			console.error(error);
		}
	}
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
    </div>
  );
}

export default AvatarUploader;