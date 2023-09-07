import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { Interval } from '@nestjs/schedule';
import { CreateMessageDto } from 'src/chat/dto/message.dto';

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
            // console.log('new comer:' + socket.id);
        });
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
        this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
    }

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() id: number) {
        // console.log('get ping=' + id)
        if (id === -1) return;
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
        this.array = this.array.filter((arr) => arr.id !== -1);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() messageBody: CreateMessageDto) {

        /*
        get all user of messageBody.idChannel
        for each user
            for socket in user
                this.socket.to(userid).emit('message', messageBody)
        */
        console.log(messageBody);
    }
}
