
import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

function AvatarUploader() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
	// console.log(e)
    const selectedImage = e.target.files?.[0];
	// console.log(selectedImage)
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
	
	//   console.log(imagePreview)
	//   console.log(reader)
    }

	if (selectedImage) {
		let formData = new FormData();
		console.log('try send photo')
		formData.append("image", selectedImage);
		try {
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
	
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" />}
    </div>
  );
}

export default AvatarUploader;