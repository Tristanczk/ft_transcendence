import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

interface Props {
    id: number;
    nb: number;
    date: number;
}

@Injectable()
export class GatewayConnectionsService {
	constructor(private prisma: PrismaService) {}
	array: Props[] = [];

	async userArrive(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: true },
        });
        this.array.push({ id: userId, nb: 0, date: Date.now() });
        // this.server.emit('updateStatus', { idUser: userId, type: 'come' });
    }

    async userLeave(userId: number) {
        // console.log('ft_left=' + userId);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: false },
        });
        // this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
    }
}