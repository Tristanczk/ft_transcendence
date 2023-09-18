import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GatewayService } from './gateway.service';

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
}
