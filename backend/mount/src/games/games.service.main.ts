import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateGameDto } from './dto/update-game.dto';
import { GameExports, UserGame } from './games.types';
import { DiffDate } from 'src/stats/stats.type';
import { Games, User } from '@prisma/client';

export type CurrentGame = {
    idGame: number;
    idPlayerA: number;
    eloPlayerA: number;
    idPlayerB: number;
    eloPlayerB: number;
};

export type VariationElo = {
    varEloA: number;
    varEloB: number;
};

export interface GamesServiceMain {
    initGame(playerA: any, idPlayerB: number, mode: number);
    updateGame(idGame: number, body: updateGameDto);
    computeElo(idGame: number, won: boolean);
    historyFiveGames(userId: number);
    transformListReadable(tab: any);
    computeDuration(date1, date2): number;
    getUserFormat(
        userId: number,
        users: any,
        score: number,
        initElo: number,
    ): UserGame;
}

@Injectable()
export class GamesServiceMainImpl {
    constructor(private prisma: PrismaService) {}

  
}
