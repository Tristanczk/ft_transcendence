import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { GamesService } from 'src/games/games.service';

@Module({
  controllers: [StatsController],
  providers: [StatsService, GamesService]
})
export class StatsModule {}
