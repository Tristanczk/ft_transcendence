import { PrismaService } from 'src/prisma/prisma.service';
import { Server } from 'socket.io';

export class GatewayConnectionService {
    constructor(private prisma: PrismaService) {}

    async sendStatus() {
        // obtenir
        console.log('nouveau');
        return '';
    }

    async userLeave(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isConnected: false },
        });
        await this.prisma.connections.deleteMany({
            where: { idUser: userId },
        });
        // this.server.emit('updateStatus', { idUser: userId, type: 'leave' });
    }
}

// obtenir tous les amis de ID
// envoyer infos a tous les amis du depart
