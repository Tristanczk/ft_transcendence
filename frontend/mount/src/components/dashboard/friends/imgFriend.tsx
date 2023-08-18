import { UserSimplified } from '../../../types';
import axios from 'axios';

interface Props {
    friend: UserSimplified;
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

function ImageFriend({ friend,  }: Props) {

	// const friendImg = getImage(friend)

	

	return (<img
		className="w-8 h-8 rounded-full"
		src={friend.avatarPath}
		alt={friend.nickname}
	/>)

}

export default ImageFriend