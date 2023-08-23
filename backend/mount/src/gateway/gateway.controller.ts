import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('gate')
export class GatewayController {
    constructor(private gatewayService: GatewayService) {}

    @Get()
    getHello(): string {
        return 'Hello from HTTP!';
    }
}
