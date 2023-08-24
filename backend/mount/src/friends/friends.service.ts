import { Injectable } from '@nestjs/common';


@Injectable()
export class FriendsService {

	getAllMyFriends(userId: number) {
		console.log('myid=' + userId)
		return 'ok my friends'
	}
}
