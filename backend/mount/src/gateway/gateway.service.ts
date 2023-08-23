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
        // console.log('test=' + userId);
        await this.prisma.connections.deleteMany({
            where: { idConnection: body.idConnection },
        });
        this.server.emit('updateStatus', { idUser: body.id, type: 'leave' });

        // console.log('left=' + body.id + ', =' + body.idConnection);
        const nbActiveConnexionsUser = await this.prisma.connections.findMany({
            where: { idUser: body.id },
        });
        if (nbActiveConnexionsUser.length === 0) {
            await this.prisma.user.update({
                where: { id: body.id },
                data: { isConnected: false },
            });
        }
        return 'ok ';
    }

    async userArrive(userId: number) {
        // console.log('ft_arrive=' + userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: true },
        });
        this.server.emit('updateStatus', { idUser: userId, type: 'come' });
    }

    async userLeave(userId: number) {
        // console.log('ft_left=' + userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: false },
        });
        await this.prisma.connections.deleteMany({
            where: { idUser: userId },
        });
        this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
    }

    @SubscribeMessage('onArrive')
    async onArrive(@MessageBody() body: OnArriveDto) {
        // console.log('got there=' + body.id + ', =' + body.idConnection);

        await this.prisma.connections.create({
            data: {
                idUser: body.id,
                idConnection: body.idConnection,
            },
        });

        await this.prisma.user.update({
            where: { id: body.id },
            data: { isConnected: true },
        });
        this.server.emit('updateStatus', { idUser: body.id, type: 'come' });
        return 'ok';
    }
}
