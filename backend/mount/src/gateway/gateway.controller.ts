import { Controller, Get } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GatewayService } from './gateway.service';

@Controller('gate')
@WebSocketGateway()
export class GatewayController {
	
	constructor(private gatewayService: GatewayService) {}

	 @Get()
	 getHello(): string {
		return 'Hello from HTTP!';
	 }

}

// constructor(private gatewayService: GatewayService) {}
