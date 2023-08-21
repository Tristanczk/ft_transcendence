import { Controller, Get } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GatewayService } from './gateway.service';

@Controller('gate')
@WebSocketGateway(3001)
export class GatewayController {
	
	constructor(private gatewayService: GatewayService) {}

	 @SubscribeMessage('newMessage')
	 onNewMessage(@MessageBody() body: any) {
		console.log(body)
		return { event: 'newMessage', data: body };
	 }

	 @Get()
	 getHello(): string {
		return 'Hello from HTTP!';
	 }

}

// constructor(private gatewayService: GatewayService) {}
