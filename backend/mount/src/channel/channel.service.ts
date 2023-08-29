import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {

	async createChannel() {
		return 'create channel';
	}

	async joinChannel() {
		return 'join channel';
	}
	
}
