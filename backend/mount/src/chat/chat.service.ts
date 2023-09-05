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
import { ChannelDto } from './dto/channel.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createChannel(
        createChannelDto: CreateChannelDto,
    ): Promise<CreateChannelDto> {
        // const channel = this.prisma.channels.findUnique({
        //     where: {
        //         name: createChannelDto.name,
        //     },
        // });

        await this.prisma.channels.create({
            data: {
                idAdmin: [createChannelDto.idUser[0]],
                idUsers: [...createChannelDto.idUser],
                isPublic: createChannelDto.isPublic,
                password: createChannelDto.password,
                name: createChannelDto.name,
            },
        });

        return {
            idUser: createChannelDto.idUser,
            name: createChannelDto.name,
            isPublic: createChannelDto.isPublic,
        };
    }

    async getChannelByUsers(
        idAdmin: number | undefined,
        idUser: number | undefined,
    ): Promise<ChannelDto | null> {
        console.log("idAdmin: " + idAdmin);
        console.log("idUser: " + idUser);
        if (idAdmin === undefined || idUser === undefined)
            return null;
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {

                    idUsers: {
                        hasEvery: [idUser, idAdmin],
                    },
                    isPublic: false,
                },
            });
            console.log("channel: " + channel);
            console.log("channel.id: " + channel.id);
            console.log("channel.name: " + channel.name);
            console.log("channel.isPublic: " + channel.isPublic);
            console.log("channel.password: " + channel.password);

            const channelDto: ChannelDto = {
                idChannel: channel.id,
                name: channel.name,
            };

            return (channelDto);
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

    async getChannels(idUser: number): Promise<ChannelDto[]> {
        let user = null;
        let channels = null;

        try {
            user = await this.prisma.user.findUnique({
                where: {
                    id: idUser,
                },
            });
        } catch (error) {}

        try {
            channels = await this.prisma.channels.findMany({
                where: {
                    idUsers: {
                        has: idUser,
                    },
                },
            });
        } catch (error) {}

        let channelDtos: ChannelDto[] = [];

        if (channels && user) {
            channelDtos = channels.map((channel) => ({
                name: channel.name,
                idChannel: channel.id,
            }));
        }
        return channelDtos;
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
                message: message.message,
            },
        });

        return {
            idChannel: message.idChannel,
            idSender: message.idSender,
            message: message.message,
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
        let channel = null;
        let user = null;

        try {
            channel = await this.prisma.channels.findUnique({
                where: {
                    id: channelId,
                },
            });
            user = await this.prisma.user.findUnique({
                where: {
                    id: idUser,
                },
            });
            if (!channel.idUsers.includes(idUser)) return null;
        } catch (error) {}

        const messages = await this.prisma.message.findMany({
            where: {
                idChannel: channelId,
            },
        });

        const messageDtos: MessageDto[] = messages.map((message) => ({
            id: message.id,
            idChannel: message.idChannel,
            idSender: message.idSender,
            message: message.message,
            createdAt: message.createdAt,
        }));
        return messageDtos;
    }
}
