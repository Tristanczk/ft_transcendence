import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/createchannel.dto';
import { EditChannelDto } from './dto/editchannel.dto';
import { MessageDto } from './dto/message.dto';
import { JoinChannelDto } from './dto/joinchannel.dto';
import { LeaveChannelDto } from './dto/leavechannel.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createChannel(createChannelDto: CreateChannelDto) : Promise<CreateChannelDto> {
        const newChannel = await this.prisma.channels.create({
            data: {
                idAdmin: [createChannelDto.idUser],
                isPublic: createChannelDto.isPublic,
                password: createChannelDto.password,
                //name: createChannelDto.name,
            },
        });

        console.log(createChannelDto.idUser);
        return {
            idUser: createChannelDto.idUser,
            name: "miao",
            isPublic: createChannelDto.isPublic
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

			if (!channel.isPublic)
				throw new Error('Channel is private');

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

    async editChannel(editChannel: EditChannelDto) {}

    async createMessage(message: MessageDto) {}
}
