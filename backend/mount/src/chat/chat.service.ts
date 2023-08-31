import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import {
    CreateMessageDto,
    DeleteMessageDto,
    MessageDto,
} from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { LeaveChannelDto } from './dto/leavechannel.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createChannel(
        createChannelDto: CreateChannelDto,
    ): Promise<CreateChannelDto> {
        const newChannel = await this.prisma.channels.create({
            data: {
                idAdmin: [createChannelDto.idUser],
                isPublic: createChannelDto.isPublic,
                password: createChannelDto.password,
                name: createChannelDto.name,
            },
        });

        console.log(createChannelDto.idUser);
        return {
            idUser: createChannelDto.idUser,
            name: 'miao',
            isPublic: createChannelDto.isPublic,
        };
    }

    async getChannelById(channelId: number) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: channelId,
                },
            });
            return channel;
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }
    }

    async joinChannel(joinChannel: JoinChannelDto) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: joinChannel.idChannel,
                },
            });

            if (!channel.isPublic) throw new Error('Channel is private');

            if (channel.password && channel.password !== joinChannel.password)
                throw new Error('Wrong password');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: joinChannel.idChannel,
                },
                data: {
                    idUsers: {
                        push: joinChannel.idUser,
                    },
                },
            });

            return updatedChannel;
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }
    }

    async leaveChannel(leaveChannel: LeaveChannelDto) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: leaveChannel.idChannel,
                },
            });
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }
    }

    async editChannel(idUser: number, editChannel: EditChannelDto) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: editChannel.id,
                },
            });
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }

        if (!editChannel.idAdmin.includes(idUser))
            throw new Error('Not authorized');

        const updatedChannel = await this.prisma.channels.update({
            where: {
                id: editChannel.id,
            },
            data: {
                idAdmin: editChannel.idAdmin,
                idUsers: editChannel.idUser,
                isPublic: editChannel.isPublic,
                name: editChannel.name,
                password: editChannel.password, //password is optional, dont know if it resets it
            },
        });

        const updatedChannelDto: EditChannelDto = {
            id: updatedChannel.id,
            idAdmin: updatedChannel.idAdmin,
            idUser: updatedChannel.idUsers,
            isPublic: updatedChannel.isPublic,
            name: updatedChannel.name,
        };
        return updatedChannelDto;
    }

    async sendMessage(message: CreateMessageDto): Promise<CreateMessageDto> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: message.idChannel,
                },
            });
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: message.idSender,
                },
            });
        } catch (error) {
            throw new NotFoundException('User not found');
        }

        const newMessage = await this.prisma.message.create({
            data: {
                idChannel: message.idChannel,
                idSender: message.idSender,
                content: message.content,
            },
        });

        return {
            idChannel: message.idChannel,
            idSender: message.idSender,
            content: message.content,
        };
    }

    async deleteMessage(idUser: number, message: DeleteMessageDto) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: message.idChannel,
                },
            });
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: message.idSender,
                },
            });
        } catch (error) {
            throw new NotFoundException('User not found');
        }

        if (idUser !== message.idSender) throw new Error('Not authorized');

        const deletedMessage = await this.prisma.message.delete({
            where: {
                id: message.idSender,
            },
        });
    }

    async getMessages(channelId: number, idUser: number) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: channelId,
                },
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: idUser,
                },
            });
            if (!channel.idUsers.includes(idUser))
                throw new Error('Not authorized');
        } catch (error) {
            throw new NotFoundException('User not found');
        }

        const messages = await this.prisma.message.findMany({
            where: {
                idChannel: channelId,
            },
        });

        const messageDtos: MessageDto[] = messages.map((message) => ({
            id: message.id,
            idChannel: message.idChannel,
            idSender: message.idSender,
            content: message.content,
            createdAt: message.createdAt,
        }));
        return messageDtos;
    }
}
