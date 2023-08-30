import { Controller, Get } from '@nestjs/common';
import { CreateService } from './create.service';

@Controller('create')
export class CreateController {
	constructor(private createService: CreateService) {}

	@Get('users')
	async createUsers() {
		return this.createService.createUsers();
	}

	@Get('games')
	async createGames() {
		return this.createService.createGames();
	}

	@Get('life')
	async createLife() {
		await this.createService.createUsers()
		await this.createService.createGames()
		return 'Enjoy your life !';
	}

	@Get('clean')
	async clean() {
		return this.createService.clean();
	}
}
