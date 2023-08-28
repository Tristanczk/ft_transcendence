import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
	constructor(private stats: StatsService) {}

	@Get('test')
	async createMe() {
		return this.stats.createMe();
	}

	@Get('testget')
	async getMe() {
		return this.stats.getMe();
	}
}
