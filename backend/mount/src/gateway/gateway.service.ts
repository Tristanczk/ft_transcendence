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

interface SocketProps {
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
        origin: [`http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`],
    },
})
export class GatewayService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    socketArray: SocketProps[] = [];

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log('new comer:' + socket.id);
        });
    }

    async userArrive(body: PingProps) {
        // console.log('ft_arrive=' + body.id);
        try {
            await this.prisma.user.update({
                where: { id: body.id },
                data: { isConnected: true },
            });
            const alreadyConnected = this.socketArray.findIndex(
                (a) => a.id === body.id,
            );
            this.socketArray.push({
                id: body.id,
                idConnection: body.idConnection,
                nb: 0,
                date: Date.now(),
            });
            if (alreadyConnected === -1) {
                this.server.emit('updateStatus', {
                    idUser: body.id,
                    type: 'come',
                });
            }
        } catch (error) {
            return;
            throw error;
        }
    }

    async userLeave(userId: number) {
        const nbConnexions = this.socketArray.reduce(
            (acc, cur) => acc + (cur.id === userId ? 1 : 0),
            0,
        );
        // console.log('ft_left=' + userId + ', nb_tab_left=' + nbConnexions);
        if (nbConnexions > 0) return;
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: { isConnected: false },
            });
            this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
        } catch (error) {
            return;
            throw error;
        }
    }

    @SubscribeMessage('ping')
    async handlePing(@MessageBody() body: PingProps) {
        const id: number = body.id;
        if (id === -1) return;
        const l = this.socketArray.findIndex(
            (a) => a.idConnection === body.idConnection,
        );
        if (l !== -1) {
            this.socketArray[l].nb++;
            this.socketArray[l].date = Date.now();
        } else {
            this.userArrive(body);
        }
    }

    @Interval(1000)
    async handleInterval() {
        const timeNow: number = Date.now();
        let idTmp: number = -1;
        this.socketArray.forEach((arr) => {
            if (arr.id !== -1) {
                if (timeNow - arr.date > 3000) {
                    idTmp = arr.id;
                    arr.id = -1;
                    this.userLeave(idTmp);
                }
            }
        });
        this.socketArray = this.socketArray.filter((arr) => arr.id !== -1);
        // console.log(this.socketArray)
    }
}
