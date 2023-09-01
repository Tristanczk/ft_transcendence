import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { StatsDashboard, UserLeaderboard } from './stats.type';
import { LeaderbordResponseDto } from './dto/leaderbord-response.dto';

@Controller('stats')
export class StatsController {
	constructor(private stats: StatsService) {}

	@Get('leaderboard')
	async getLeaderboard(): Promise<UserLeaderboard[]> {
		return this.stats.getLeaderboard();
	}

	@UseGuards(JwtGuard)
	@Get()
	async getMyStats(@GetUser('id') id: number): Promise<StatsDashboard> {
		const stats: StatsDashboard = {
			me: await this.stats.getStatsUser(id),
			global: await this.stats.getGlobalStats(),
		}
		return stats;
	}

	@Get(':id')
	async getStats(@Param('id', ParseIntPipe) idUser: number) {
		const stats: StatsDashboard = {
			me: await this.stats.getStatsUser(idUser),
			global: await this.stats.getGlobalStats(),
		}
		return stats;
	}

	@Get('graph/:id')
	async getDataGraph(@Param('id', ParseIntPipe) idUser: number) {
		return this.stats.getDataGraph(idUser);
	}

}
