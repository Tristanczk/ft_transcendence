import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
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
            name,
            isPublic = true,
            password = "",
        }: {
            idAdmin: number;
            name:string;
            isPublic?: boolean;
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

        console.log('handleNewChannel recived createChannel');
        this.server.emit('createChannel', { idAdmin, isPublic, password });
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
import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import ChatWindow, { ChatWindowProps } from '../components/chatpage/ChatWindow';
import { MessageProps } from '../components/chatpage/Message';
import { MessageInput } from '../components/chatpage/MessageInput';
import { socket as constSocket } from '../context/WebsocketContext';
import ButtonsBar from '../components/chatpage/ButtonsBar';
import ChannelsBox, { ChannelProps } from '../components/chatpage/Channels';

function ChatPage() {
    const [socket, setSocket] = useState<Socket | undefined>(undefined); // Initialize socket as undefined
    const [messages, setMessages] = useState<ChatWindowProps['messages']>([]);
    const [channels, setChannels] = useState<ChannelProps[]>([]);

    const send = (message: MessageProps) => {
        socket?.emit('message', {
            idSender: message.idSender,
            idChannel: message.idChannel,
            message: message.message,
        });
    };

    const createChannel = (channel: ChannelProps) => {
        socket?.emit('createChannel', {
            idAdmin: channel.idAdmin,
            name: channel.name,
        });
        console.log('emit createChannel');
    };

    useEffect(() => {
        setSocket(constSocket);
    }, []); // Empty dependency array ensures this effect runs only once

    useEffect(() => {
        if (socket) {
            const messageListener = ({
                idSender,
                idChannel,
                message,
            }: {
                idSender: number;
                idChannel: number;
                message: string;
            }) => {
                console.log(idSender);
                const newMessage: MessageProps = {
                    idSender: idSender,
                    idChannel: idChannel,
                    message: message,
                };

                setMessages((oldMessages) => [...oldMessages, newMessage]);
                console.log('setting oldmessages to message');
            };

            const channelCreator = ({
                idAdmin,
                idChannel,
                name,
            }: {
                idAdmin: number;
                idChannel: number;
                name: string;
            }) => {
                setChannels((oldChannels) => [
                    ...oldChannels,
                    { idAdmin, idChannel, name },
                ]);

                console.log('setting oldchannels to channel');
            };

            //socket.on('message', messageListener);

            socket.on('createChannel', channelCreator);

            return () => {
                socket.off('message', messageListener);
            };
        }
    }, [socket]); // Make sure to include socket as a dependency

    console.log(messages);
    return (
        <div className="ChatPage">
            <ButtonsBar createChannel={createChannel}/>
            <ChannelsBox channels={channels} />
            <section className="Tchatbox">
                <ChatWindow messages={messages} />
                <MessageInput send={send} />
            </section>
        </div>
    );
}

export default ChatPage;import {
    Controller,
    UseGuards,
    Get,
    Post,
    Param,
    ParseIntPipe,
    Delete,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/decorator';
import { GetAllUsersResponseDto } from '../friends/dto/get-all-users.dto';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
    constructor(private friendService: FriendsService) {}

    @Get('me')
    getMe(@GetUser('id') userId: number): Promise<GetAllUsersResponseDto[]> {
        return this.friendService.getAllMyFriends(userId);
    }

	@Get('select/:nick')
	getListFriendChoice(@GetUser('id') userId: number, @Param('nick') nick: string) {
		return this.friendService.getListFriendChoice(userId, nick);
	}

    @Post(':id')
    postFriend(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) userToAdd: number,
    ) {
        return this.friendService.addNewFriend(userId, userToAdd);
    }

    @Delete(':id')
    deleteFriend(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) userToDelete: number,
    ) {
        return this.friendService.deleteFriend(userId, userToDelete);
    }
}

/*
ENDPOINTS dans friends:
GET friends/me	: retourne tous mes amis
GET friends/possiblefriends : retourne toutes les personnes pouvant etre mes amis
POST friends/:id : ajoute l'id a mes amis (verif si pas deja mon amis)
*/
