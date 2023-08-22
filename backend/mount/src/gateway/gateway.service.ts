import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { GetUser } from 'src/auth/decorator';
import { GatewayConnectionService } from './gateway.handleCo.service';

@Injectable()
@WebSocketGateway({
	cors: {
		origin: ['http://localhost:3000']
	}
})
export class GatewayService implements OnModuleInit {

	// constructor(private gatewayConnectionService: GatewayConnectionService) {}

	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.server.on('connection', (socket) => {
			console.log('new comer:'+socket.id)
		})
		// console.log('connected')
	}


	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body)
		this.server.emit('onMessage', {
			msg: 'New message for you',
			content: body,
		})
		return 'ok'
	}

	@SubscribeMessage('onLeave')
	onLeave(@MessageBody() body: any) {
		console.log('left='+body)
		return 'ok'
	}

	@SubscribeMessage('onArrive')
	onArrive(@MessageBody() body: any) {
		console.log('got there='+body)
		return 'ok'
	}

}
