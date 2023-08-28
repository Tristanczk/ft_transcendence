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
        // console.log('test=' + idUser);
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

    async userArrive(idUser: number) {
        // console.log('ft_arrive=' + idUser);
        await this.prisma.user.update({
            where: { id: idUser },
            data: { isConnected: true },
        });
        this.array.push({ id: idUser, nb: 0, date: Date.now() });
        this.server.emit('updateStatus', { idUser: idUser, type: 'come' });
    }

    async userLeave(idUser: number) {
        // console.log('ft_left=' + idUser);
        await this.prisma.user.update({
            where: { id: idUser },
            data: { isConnected: false },
        });
        await this.prisma.connections.deleteMany({
            where: { idUser: idUser },
        });
        this.server.emit('updateStatus', { idUser: idUser, type: 'leave' });
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
        const idUser = Object.keys(this.userToSocketMap).find(
            (key) => this.userToSocketMap[key] === client,
        );
        if (idUser) {
            delete this.userToSocketMap[idUser];
        }
    }

    @SubscribeMessage('authenticate')
    handleAuthenticate(@MessageBody() idUser: string): void {
        this.userToSocketMap[idUser] = this.server;
        console.log(idUser + ' !');
    }

    @SubscribeMessage('createChannel')
    async handleNewChannel(
        @MessageBody()
        {
            idAdmin,
            isPublic,
            password,
        }: {
            idAdmin: number;
            isPublic: boolean;
            password?: string;
        },
    ) {
        await this.prisma.channels.create({
            data: {
                idAdmin: [idAdmin],
                idUsers: [idAdmin],
                isPublic: isPublic,
                password: password,
            },
        });
    }

    @SubscribeMessage('deleteChannel')
    async handleDeleteChannel(
        @MessageBody()
        { idChannel }: { idChannel: number },
    ) {
        await this.prisma.channels.delete({
            where: {
                id: idChannel,
            },
        });
    }

    @SubscribeMessage('joinChannel')
    async handleJoinChannel(
        @MessageBody()
        {
            idUser,
            idChannel,
            password,
        }: {
            idUser: number;
            idChannel: number;
            password?: string;
        },
    ) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: idChannel,
            },
        });

        if (!channel) throw new ForbiddenException('Channel not found');

        if (channel.isPublic) {
            await this.prisma.channels.update({
                where: {
                    id: idChannel,
                },
                data: {
                    idUsers: {
                        push: idUser,
                    },
                },
            });
        } else {
            if (channel.password === password) {
                await this.prisma.channels.update({
                    where: {
                        id: idChannel,
                    },
                    data: {
                        idUsers: {
                            push: idUser,
                        },
                    },
                });
            } else {
                throw new ForbiddenException('Wrong password');
            }
        }
    }

    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(
        @MessageBody()
        {
            idUser,
            idChannel,
        }: {
            idUser: number;
            idChannel: number;
        },
    ) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: idChannel,
            },
        });

        if (!channel) throw new ForbiddenException('Channel not found');

        await this.prisma.channels.update({
            where: {
                id: idChannel,
            },
            data: {
                idUsers: {
                    set: channel.idUsers.filter((id) => id !== idUser),
                },
            },
        });
    }

    @SubscribeMessage('broadcastMessageToChannel')
    async broadcastMessageToChannel(idUser:number, idChannel:number, message:string) {
        const channel = await this.prisma.channels.findUnique({
            where: {
                id: idChannel,
            },
        });

        if (!channel) throw new ForbiddenException('Channel not found');

        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    in: channel.idUsers,
                },
            },
        });

        const sockets = users.map((user) => this.userToSocketMap[user.id]); // Get the socket for each user

        sockets.forEach((socket) => {
            socket.emit('message', { idSender: idUser, idChannel: idChannel, message: message});
        });
    };

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody()
        {
            idSender,
            idChannel,
            message,
        }: {
            idSender: number;
            idChannel: number;
            message: string;
        },
    ) {
        //Store message in DB, verifier is channel existe?
        await this.prisma.message.create({
            data: {
                idSender: idSender,
                idChannel: idChannel,
            },
        });

        // Broadcast the message to all connected clients
        const user = await this.prisma.connections.findFirst({
            where: {
                idUser: Number(idSender),
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
        this.server.emit('message', { idSender, idChannel, message });
    }
}
