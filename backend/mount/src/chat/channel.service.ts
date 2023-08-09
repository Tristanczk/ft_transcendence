import { Injectable, Logger } from '@nestjs/common';
import {
    CreateChannelFields,
    JoinChannelFields,
    RejoinChannelFields,
} from './channel.types';
import { PrismaService } from 'src/prisma/prisma.service';

// Channel Service, implement all the logic of channel functions
@Injectable()
export class ChannelService {
    private readonly logger = new Logger(ChannelService.name);
    constructor(private prisma: PrismaService) {}

    async createChannel(fields: CreateChannelFields) {
        //Need to change that

        const existingChannel = await this.prisma.channel.findFirst({
            where: {
                name: fields.name,
            },
        });

        if (existingChannel) {
            // Send back message name not available
            return;
        }

        this.logger.debug(`Creating channel ${fields.name}`);
        const createdChannel = await this.prisma.channel.create({
            data: {
                admin: fields.admin,
                name: fields.name,
                topic: fields.topic,
            },
        });

        return {
            channel: createdChannel,
        };
    }

    async joinChannel(fields: JoinChannelFields) {
        // const joinedChannel = await this.channelRepository.getChannel(
        //     fields.channelID,
        // );
        const existingChannel = await this.prisma.channel.findFirst({
          where: {
              name: fields.name,
          },
      });

      if (!existingChannel) {
          // Send back message channel does not exist
          return;
      }

      // Password check ?

        this.logger.debug(`Fetching channel ${fields.name}`);
         return {
           channel: existingChannel,
         };
    }

    async rejoinChannel(fields: RejoinChannelFields) {
        // const joinedChannel = await this.channelRepository.addUserChannel(
        //     fields,
        // );
        // return joinedChannel;
    }
}
