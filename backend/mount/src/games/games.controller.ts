import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { InitGameDto } from './dto/init-game.dto';
import { GamesService } from './games.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { updateGameDto } from './dto/update-game.dto';

@Controller('games')
export class GamesController {
    constructor(private gamesService: GamesService) {}

    @UseGuards(JwtGuard)
    @Post('init')
    async initGame(@GetUser('id') idUser: number, @Body() body: InitGameDto) {
        return this.gamesService.initGame(idUser, body.idPlayerB, body.mode);
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    async updateGame(
        @Param('id', ParseIntPipe) idGame: number,
        @Body() body: updateGameDto,
    ) {
        return this.gamesService.updateGame(idGame, body);
    }

    @UseGuards(JwtGuard)
    @Get('short/me')
    async myHistoryFiveGames(@GetUser('id') idUser: number) {
        return this.gamesService.historyFiveGames(idUser);
    }

    @Get('short/:id')
    async historyFiveGames(@Param('id', ParseIntPipe) idUser: number) {
        return this.gamesService.historyFiveGames(idUser);
    }

	@Get('all/:id')
    async historyAllGames(@Param('id', ParseIntPipe) idUser: number) {
        return this.gamesService.historyAllGames(idUser);
    }

    @Get('achiev/:id')
    async getAchievementsUser(@Param('id', ParseIntPipe) idUser: number) {
        return this.gamesService.getAchievementsUser(idUser);
    }
}
