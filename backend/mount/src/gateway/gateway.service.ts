import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { OnArriveDto } from './dto/onArrive.dto';

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
    },
})
export class GatewayService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('new comer:' + socket.id);
        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('onMessage', {
            msg: 'New message for you',
            content: body,
        });
        return 'ok';
    }

    @SubscribeMessage('onLeave')
    async onLeave(@MessageBody() body: OnArriveDto) {
        const retour = await this.prisma.connections.deleteMany({
            where: { idConnection: body.idConnection },
        });
        console.log('left=' + body.id + ', =' + body.idConnection);

        return 'ok';
    }

    @SubscribeMessage('onArrive')
    async onArrive(@MessageBody() body: OnArriveDto) {
        console.log('got there=' + body.id + ', =' + body.idConnection);

        const retour = await this.prisma.connections.create({
            data: {
                idUser: body.id,
                idConnection: body.idConnection,
            },
        });
        return 'ok';
    }
}

// const newFriend = await this.prisma.friends.delete({
// where: { id: isFriend.id },
// });

// const newFriend = await this.prisma.friends.create({
// data: {
// idUserA: userId,
// idUserB: userNewFriend,
// },
// });
