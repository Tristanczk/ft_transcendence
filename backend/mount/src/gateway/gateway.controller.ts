import { Controller, Get } from '@nestjs/common';

@Controller('gate')
export class GatewayController {
    @Get()
    getHello(): string {
        return 'Hello from HTTP!';
    }
}
