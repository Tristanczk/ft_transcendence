import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Invite } from 'src/shared/game_info';

@Controller('gate')
export class GatewayController {
    constructor(private gatewayService: GatewayService) {}
    @Get('gameStatus/:id')
    getGameStatus(@Param('id', ParseIntPipe) userId: number): {
        status: string;
        gameId: string;
    } {
        return this.gatewayService.getGameStatus(userId);
    }

    @Get('gameInvites/:id')
    getGameInvites(@Param('id', ParseIntPipe) userId: number): Promise<{
        invites: Invite[];
    }> {
        return this.gatewayService.getGameInvites(userId);
    }
}
