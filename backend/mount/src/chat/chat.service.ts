import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto, ChannelIdDto, CreateChannelDto, CreateMessageDto, EditChannelDto, EditChannelLeaveDto, EditChannelNameDto, EditChannelUserDto, EditPasswordDto, GetChannelDto, JoinChannelDto, MessageDto, MuteUserDto, UserSimplifiedDto } from './dto/channel.dto';

import { GatewayService } from 'src/gateway/gateway.service';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class ChatService {
    constructor(
        private prisma: PrismaService,
        private gateway: GatewayService,
    ) {}

    async createChannel(
        createChannelDto: CreateChannelDto,
    ): Promise<CreateChannelDto> {
        await this.prisma.channels.create({
            data: {
                idOwner: createChannelDto.idUser[0],
                idAdmin: [...createChannelDto.idUser],
                idUsers: [...createChannelDto.idUser],
                isPublic: createChannelDto.isPublic,
                password: createChannelDto.password,
                name: createChannelDto.name,
            },
        });

        this.gateway.server.emit('reloadchannels');

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

    async isChannelAdmin(channelDto: ChannelIdDto): Promise<boolean> {
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

    async isUserBanned(channelDto: ChannelIdDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(channelDto.idChannel),
                },
            });

            if (
                channel &&
                channel.idBannedUsers.includes(Number(channelDto.idUser))
            ) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    async isUserInChannel(channelDto: ChannelIdDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(channelDto.idChannel),
                },
            });

            if (
                channel &&
                channel.idUsers.includes(Number(channelDto.idUser))
            ) {
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

            if (channel.idBannedUsers.includes(joinChannel.idUser))
                throw new Error('You are banne banned');

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
            let updatedChannel = null;

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

                this.gateway.server.emit('reloadchannels');

                return updatedChannel;
            }

            if (channel.idAdmin.length === 1) {
                const idToAdd = channel.idUsers.find(
                    (id) => id !== leaveChannel.idRequester,
                );

                if (idToAdd !== undefined) {
                    const filteredIdAdmin = channel.idAdmin.filter(
                        (id) => id !== leaveChannel.idRequester
                    );
                    filteredIdAdmin.push(idToAdd);

                    updatedChannel = await this.prisma.channels.update({
                        where: {
                            id: leaveChannel.id,
                        },
                        data: {
                            idAdmin: {
                                set: filteredIdAdmin,
                            },
                            idUsers: {
                                set: channel.idUsers.filter(
                                    (id) => id !== leaveChannel.idRequester,
                                ),
                            },
                        },
                    });

                    const user = this.gateway.users.getIndivUserById(
                        updatedChannel.idUsers[0],
                    );
                    if (user) {
                        user.sockets.forEach((socket) => {
                            this.gateway.server
                                .to(socket)
                                .emit('reloadchannel', updatedChannel.id);
                        });
                    }
                }
            } else {
                updatedChannel = await this.prisma.channels.update({
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
            }

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

    async banUser(
        editChannel: EditChannelUserDto,
    ): Promise<EditChannelDto | string> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.id,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized, Not admin');

            if (editChannel.idUser === editChannel.idRequester)
                throw new Error('Not authorized, Cannot ban yourself');

            if (channel.idAdmin.includes(editChannel.idUser) && editChannel.idRequester !== channel.idOwner)
                throw new Error('Not authorized, User is admin');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.id,
                },
                data: {
                    idUsers: {
                        set: channel.idUsers.filter(
                            (id) => id !== editChannel.idUser,
                        ),
                    },
                },
            });

            if (editChannel.isBanned) {
                await this.prisma.channels.update({
                    where: {
                        id: editChannel.id,
                    },
                    data: {
                        idBannedUsers: {
                            push: editChannel.idUser,
                        },
                    },
                });
            }

            const user = this.gateway.users.getIndivUserById(
                editChannel.idUser,
            );
            if (user) {
                user.sockets.forEach((socket) => {
                    this.gateway.server.to(socket).emit('ban');
                });
            }

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
            return error.message;
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

            channel.idUsers.forEach((id) => {
                const user = this.gateway.users.getIndivUserById(id);
                if (user) {
                    user.sockets.forEach((socket) => {
                        this.gateway.server.to(socket).emit('reloadchannel', editChannel.id);
                    });
                }
            });
            return updatedChannelDto;
        } catch (error) {
            console.log(error);
        }
    }

    async addAdmin(
        editChannel: EditChannelUserDto,
    ): Promise<EditChannelDto | string> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.id,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized');

            if (channel.idAdmin.includes(editChannel.idUser))
                throw new Error('Not authorized, User already admin');

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.id,
                },
                data: {
                    idAdmin: {
                        push: editChannel.idUser,
                    },
                },
            });

            const user = this.gateway.users.getIndivUserById(
                editChannel.idUser,
            );
            if (user) {
                user.sockets.forEach((socket) => {
                    this.gateway.server.to(socket).emit('reloadchannel', editChannel.id);
                });
            }

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
            return error.message;
        }
    }

    async muteUser(editChannel: MuteUserDto): Promise<EditChannelDto | string> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: editChannel.idChannel,
                },
            });

            if (!channel.idAdmin.includes(editChannel.idRequester))
                throw new Error('Not authorized');

            if (channel.idAdmin.includes(editChannel.idUser)  && editChannel.idRequester !== channel.idOwner)
                throw new Error('Not authorized, User is admin');

            channel.mutedUsers.push([
                { idUser: editChannel.idUser, time: editChannel.time },
            ]);

            const updatedChannel = await this.prisma.channels.update({
                where: {
                    id: editChannel.idChannel,
                },
                data: {
                    mutedUsers: channel.mutedUsers,
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
            return error.message;
        }
    }

    @Interval(6000) // Runs every minute
    async unmuteUser() {
        const currentTime = new Date().getTime();
        try {
            const channels = await this.prisma.channels.findMany({
                where: {
                    isPublic: true,
                },
            });

            for (const channel of channels) {
                const unmutedUsers = [];
                for (const user of channel.mutedUsers) {
                    const unmuteTime = new Date(user[0].time).getTime();
                    if (unmuteTime <= currentTime) {
                    } else {
                        unmutedUsers.push(user);
                    }
                }

                await this.prisma.channels.update({
                    where: { id: channel.id },
                    data: {
                        mutedUsers: {
                            set: unmutedUsers,
                        },
                    },
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async isUserMuted(channelDto: ChannelIdDto): Promise<boolean> {
        try {
            const channel = await this.prisma.channels.findFirst({
                where: {
                    id: Number(channelDto.idChannel),
                },
            });

            if (!channel) throw new Error('Channel not found');

            for (const user of channel.mutedUsers) {
                if (Number(user[0].idUser) === Number(channelDto.idUser)) {
                    return true;
                }
            }
        } catch (error) {
            console.log(error);
        }
        return false;
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

    async getChannelUsers(idChannel: number): Promise<UserSimplifiedDto[]> {
        let users: UserSimplifiedDto[] = [];

        try {
            const channel = await this.prisma.channels.findUnique({
                where: {
                    id: Number(idChannel),
                },
            });

            for (const id of channel.idUsers) {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: Number(id),
                    },
                });

                const userDto: UserSimplifiedDto = {
                    id: user.id,
                    nickname: user.nickname,
                    avatarPath: user.avatarPath,
                };
                users.push(userDto);
            }
        } catch (error) {
            console.log(error);
        }
        return users;
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
                const user = this.gateway.users.getIndivUserById(id);
                if (user) {
                    user.sockets.forEach((socket) => {
                        this.gateway.server.to(socket).emit('message', message);
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }

        return newMessage;
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
