import { useEffect, useState } from 'react';
import { UserSimplified } from '../../../types';
import axios from 'axios';

interface Props {
    friend: UserSimplified;
	path: any;
}

// async function getImage({ friend  }: Props) {
// 	async function loadFriendImage(userId: number) {
//         try {
//             const imgPath = await getImg(userId);
//             return imgPath;
//         } catch (error) {
//             console.error(error);
//             return './avatars/bart.png'; // Ou une autre valeur par défaut
//         }
//     }

//     async function getImg(userId: number) {
//         try {
//             const response = await axios.get(
//                 `http://localhost:3333/users/img/${userId}`,
//                 { params: { id: userId }, withCredentials: true },
//             );

//             console.log(response);
//             return response.data;
//         } catch (error) {
//             console.error(error);
//         }
//         return './avatars/bart.png';
//     }

// 	const friendImg = await loadFriendImage(friend.id)
// 	return friendImg;
// }


	// http://localhost:3333/users/img/${userId}`,

			// const imageSrc = `data:image/png;base64,${response.data}`;
			
			// console.log(imageSrc);



	// const bonjour = imgY;
	// console.log('data:')
	// console.log(imgY)

	// console.log('friend elem:')
	// console.log(friend)
	// console.log('path:')
	// console.log(path.data)

	// const img = getImg(1);
    // console.log('after');
    // console.log(img)
    // console.log('after');

	// const imageSrc = `data:image/png;base64,${path.data}`;

	// console.log(imageSrc)

function ImageFriend({ friend, path }: Props) {

	const [imgY, setImgY] = useState<any>();

	useEffect(() => {
        const fetchImg = async () => {
           const imageDataUrl = await getImg(friend.id);
		   if (imageDataUrl) {
			// const blob = await fetch(imageDataUrl).then((res) => res.blob());
			// console.log(blob)

			imageDataUrl.toBlob(function(blob: any) {
			
			let link = URL.createObjectURL(blob);
			
			// supprimer la référence blob interne, pour laisser le navigateur en effacer la mémoire
			// URL.revokeObjectURL(link);
			}, 'image/png');
		   }
        };
        fetchImg();
    }, []);

	async function getImg(userId: number) {
		try {
			const response = await axios.get(
				`http://localhost:3333/users/img/2`,
				{ params: {  }, withCredentials: true },
			);			
			// const imageDataUrl = `data:image/png;base64,${response.data}`;
			const imageDataUrl = response.data;
    		setImgY(imageDataUrl);
			return response.data;
		} catch (error) {
			console.error(error);
		}
		return 'to handle';
	}

	// let blob = new Blob(imgY.data, {type: 'image/png'});

	// let reader = new FileReader();
	// reader.readAsDataURL(blob); 

	// console.log(blob)


	 //{`data:image/png;base64,${imgY.data}`}

	return imgY ? (
	<>
	{/* {console.log(imgY.data)} */}
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

export default ImageFriend
