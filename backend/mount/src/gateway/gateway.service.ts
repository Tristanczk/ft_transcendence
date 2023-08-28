import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { OnArriveDto } from './dto/onArrive.dto';
import { Interval } from '@nestjs/schedule';

interface Props {
    id: number;
    nb: number;
    date: number;
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
    },
})
export class GatewayService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    array: Props[] = [];

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
        this.array.push({ id: userId, nb: 0, date: Date.now() });
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
        //console.log('got there=' + body.id + ', =' + body.idConnection);

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

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() id: number) {
        const l = this.array.findIndex((a) => a.id === id);

        if (l !== -1) {
            this.array[l].nb++;
            this.array[l].date = Date.now();
        } else {
            this.userArrive(id);
        }
    }

    @Interval(5000)
    async handleInterval() {
        const timeNow: number = Date.now();
        this.array.forEach((arr) => {
            if (arr.id !== -1) {
                if (timeNow - arr.date > 5000) {
                    this.userLeave(arr.id);
                    arr.id = -1;
                }
            }
        });
    }

    userToSocketMap: Record<string, any> = {}; // Store user-to-socket mapping

    handleDisconnect(client: any): void {
        // Remove the user-to-socket mapping when a client disconnects
        const userId = Object.keys(this.userToSocketMap).find(
            (key) => this.userToSocketMap[key] === client,
        );
        if (userId) {   
            delete this.userToSocketMap[userId];
        }
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(@MessageBody() userId: string): void {
        this.userToSocketMap[userId] = this.server;
        console.log(userId + ' !');
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody()
        { senderId, message }: { senderId: number; message: string },
    ) {
        // Broadcast the message to all connected clients
        const user = await this.prisma.connections.findFirst({
            where: {
                idUser: Number(senderId),
            },
        });
        // if (!user) {
        //     throw new ForbiddenException('User id not found');
        // }

        // console.log(
        //     'handleMessage from User ' +
        //         user.idUser +
        //         ' : ' +
        //         user.idConnection +
        //         '\n' +
        //         message,
        // );
        this.server.emit('message', { senderId, message });
    }
}
