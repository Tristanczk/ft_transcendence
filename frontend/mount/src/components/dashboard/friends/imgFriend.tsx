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

function ImageFriend({ friend, path }: Props) {

	console.log('friend elem:')
	console.log(friend)
	console.log('path:')
	console.log(path)

	const imageSrc = `data:image/png;base64,${path}`;


	return (<img
		className="w-8 h-8 rounded-full"
		src={imageSrc}
		alt={friend.nickname}
	/>);

}

export default ImageFriend