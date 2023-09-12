import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import {
    EditChannelDto,
    EditChannelLeaveDto,
    EditChannelNameDto,
    EditChannelUserDto,
    EditPasswordDto,
} from './dto/editchannel.dto';
import {
    CreateMessageDto,
    DeleteMessageDto,
    MessageDto,
} from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { ChannelDto, isChannelAdminDto } from './dto/channel.dto';
import { GetChannelDto } from './dto/getchannel.dto';
import { channel } from 'diagnostics_channel';
import { EditUserDto } from 'src/user/dto';
import { GatewayService } from 'src/gateway/gateway.service';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private gateway: GatewayService) {}

    async createChannel(
        createChannelDto: CreateChannelDto,
    ): Promise<CreateChannelDto> {

        await this.prisma.channels.create({
            data: {
                idAdmin: [createChannelDto.idUser],
                idUsers: [createChannelDto.idUser],
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

    async getChannel(idChannel: number): Promise<ChannelDto | null> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(idChannel),
                },
            });

            const channelDto: ChannelDto = {
                id: channel.id,
                idAdmin: channel.idAdmin,
                idUser: channel.idUsers,
                name: channel.name,
                isPublic: channel.isPublic,
            };

            return channelDto;
        } catch (error) {}
        return null;
    }

    async getChannelByUsers(
        getChannel: GetChannelDto,
    ): Promise<ChannelDto | null> {
        if (getChannel.idAdmin === undefined || getChannel.idUser === undefined)
            return null;
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    idUsers: {
                        hasEvery: [
                            Number(getChannel.idAdmin),
                            Number(getChannel.idUser),
                        ],
                    },
                    isPublic: false,
                },
            });

            const channelDto: ChannelDto = {
                id: channel.id,
                idAdmin: channel.idAdmin,
                idUser: channel.idUsers,
                name: channel.name,
                isPublic: channel.isPublic,
            };

            return channelDto;
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    async isChannelOpen(idChannel: number): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(idChannel),
                },
            });

            if (channel.password.length < 2) return true;
        } catch (error) {}
        return false;
    }

    async isChannelAdmin(channelDto: isChannelAdminDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(channelDto.idChannel),
                },
            });

            if (channel && channel.idAdmin.includes(channelDto.idUser)) {
                return true;
            }
        } catch (error) {}
        return false;
    }

    async isUserInChannel(channelDto: isChannelAdminDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(channelDto.idChannel),
                },
            });

            console.log(channelDto);
            console.log(channel);
            if (channel && channel.idUsers.includes(Number(channelDto.idUser))) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async joinChannel(joinChannel: JoinChannelDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: joinChannel.idChannel,
                },
            });

            if (channel.password && channel.password !== joinChannel.password)
                throw new Error('Wrong password');

            await this.prisma.channels.update({
                where: {
                    id: joinChannel.idChannel,
                },
                data: {
                    idUsers: {
                        push: joinChannel.idUser,
                    },
                },
            });

            return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async leaveChannel(leaveChannel: EditChannelLeaveDto) {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: leaveChannel.id,
                },
            });

            if (channel.idUsers.length === 1) {
                const updatedChannel = await this.prisma.channels.delete({
                    where: {
                        id: leaveChannel.id,
                    },
                });
                return updatedChannel;
            }

            if (channel.idAdmin.length === 1) {
                const updatedChannel = await this.prisma.channels.update({
                    where: {
                        id: leaveChannel.id,
                    },
                    data: {
                        idAdmin: {
                            push: channel.idUsers[0],
                        },
                    },
                });
            }

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: leaveChannel.id,
                },
                data: {
                    idAdmin: {
                        set: channel.idAdmin.filter(
                            (id) => id !== leaveChannel.idRequester,
                        ),
                    },
                    idUsers: {
                        set: channel.idUsers.filter(
                            (id) => id !== leaveChannel.idRequester,
                        ),
                    },
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
        } catch (error) {
            throw new NotFoundException('Channel not found');
        }
    }

    async editPassword(editPassword: EditPasswordDto) {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editPassword.id,
                },
            });

            console.log(channel.idAdmin);
            if (!channel.idAdmin.includes(editPassword.idRequester))
                throw new Error('Not authorized');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editPassword.id,
                },
                data: {
                    password: editPassword.password,
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
        } catch (error) {
            console.log(error);
        }
    }

    async banUser(editChannel: EditChannelUserDto): Promise<EditChannelDto> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.id,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized');

            if (channel.idAdmin.includes(editChannel.idUser))
                throw new Error('Not authorized');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.id,
                },
                data: {
                    idUsers: {
                        set: channel.idUsers.filter(
                            (id) => id !== editChannel.idRequester,
                        ),
                    },
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
        } catch (error) {
            console.log(error);
        }
    }

    async editName(editChannel: EditChannelNameDto): Promise<EditChannelDto> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.id,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.id,
                },
                data: {
                    name: editChannel.name,
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
        } catch (error) {
            console.log(error);
        }
    }

    async addAdmin(editChannel: EditChannelUserDto): Promise<EditChannelDto> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.id,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized');

            if (channel.idAdmin.includes(editChannel.idUser))
                throw new Error('Already admin');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.id,
                },
                data: {
                    idAdmin: {
                        push: editChannel.idUser,
                    },
                    idUsers: {
                        push: editChannel.idUser,
                    },
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
        } catch (error) {
            console.log(error);
        }
    }

    async getChannels(): Promise<ChannelDto[]> {
        let channels = null;

        try {
            channels = await this.prisma.channels.findMany({
                where: {
                    isPublic: {
                        equals: true,
                    },
                },
            });
        } catch (error) {}

        let channelDtos: ChannelDto[] = [];

        if (channels) {
            channelDtos = channels.map((channel) => ({
                name: channel.name,
                id: channel.id,
                isPublic: channel.isPublic,
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

        try {
            const channel = await this.prisma.channels.findUnique({
                where: { id: message.idChannel },
            });

            channel.idUsers.forEach((id) => {
                console.log('userid: ' + id);
                const user = this.gateway.users.getIndivUserById(id);
                if (user) {
                    user.sockets.forEach((socket) => {
                        console.log('socket: ' + socket);
                        this.gateway.server.to(socket).emit('message', message);
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }

        return newMessage;
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
