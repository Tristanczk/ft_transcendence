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

interface Props {
    id: number;
    idConnection: string;
    nb: number;
    date: number;
}

interface PingProps {
    id: number;
    idConnection: string;
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

    async userArrive(body: PingProps) {
        // console.log('ft_arrive=' + body.id);
        await this.prisma.user.update({
            where: { id: body.id },
            data: { isConnected: true },
        });
		const alreadyConnected = this.array.findIndex((a) => a.id === body.id);
        this.array.push({
            id: body.id,
            idConnection: body.idConnection,
            nb: 0,
            date: Date.now(),
        });
        if (alreadyConnected === -1) {
            this.server.emit('updateStatus', { idUser: body.id, type: 'come' });
        }
    }

    async userLeave(userId: number) {
        console.log('ft_left=' + userId);
		//implementer userLeave par onglet
		// const nbConnexions = this.array.reduce((acc, cur) => a.id === body.id);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: false },
        });
        this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
    }

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() body: PingProps) {
        console.log('get ping= ');
        console.log(body);
        const id: number = body.id;
        if (id === -1) return;
        const l = this.array.findIndex(
            (a) => a.idConnection === body.idConnection,
        );
        if (l !== -1) {
            this.array[l].nb++;
            this.array[l].date = Date.now();
        } else {
            this.userArrive(body);
        }
    }

    @Interval(3000)
    async handleInterval() {
        const timeNow: number = Date.now();
        this.array.forEach((arr) => {
            if (arr.id !== -1) {
                if (timeNow - arr.date > 3000) {
                    this.userLeave(arr.id);
                    arr.id = -1;
                }
            }
        });
        this.array = this.array.filter((arr) => arr.id !== -1);
        console.log('clients');
        console.log(this.array);
    }
}
