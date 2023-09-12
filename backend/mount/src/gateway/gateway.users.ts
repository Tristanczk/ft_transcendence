import { PrismaService } from 'src/prisma/prisma.service';
import { HandlePingProp, SocketProps } from './gateway.service';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { Interval } from '@nestjs/schedule';
import { Inject } from '@nestjs/common';

type DefineTitle = {
    indivUser: IndivUser | null;
    lastPing: number;
    key: string;
};

export type ResponseCheckConnexion = {
    inNotify: boolean;
    outNotify: boolean;
    outId: number;
};

export class Users {
    users: IndivUser[];
    private nbUsers: number;
    private socketIds: Record<string, DefineTitle> = {};

    // @Inject('WebSocketServer') private readonly webSocketServer: Server
    constructor(private prisma: PrismaService) {
        this.users = [];
        this.nbUsers = 0;
    }

    private async verifUserId(userId: number): Promise<boolean> {
        if (userId === -1) return false;
        if (userId !== -1) {
            try {
                const userSearched: User | null =
                    await this.prisma.user.findUnique({
                        where: { id: userId },
                    });
                if (!userSearched) return false;
                return true;
            } catch {
                return false;
            }
        }
    }

    //si userId = -1, on a un user inconnu
    //return true si creation user, false sinon
    async addUserToSocket(userId: number, socketId: string): Promise<boolean> {
        let userToAdd: IndivUser | null = this.getIndivUserById(userId);
        if (!userToAdd) {
            //verif user
            let userIdVerified: number = -1;
            if (await this.verifUserId(userId)) userIdVerified = userId;

            //cree nouveau user et ajoute au tableau de users
            userToAdd = new IndivUser(userIdVerified, socketId, this.prisma);
            this.users.push(userToAdd);
            this.nbUsers += 1;
        } else {
            userToAdd.addNewSocketId(socketId);
        }

        //ajoute au tableau de sockets
        this.socketIds[socketId] = {
            indivUser: userToAdd,
            lastPing: Date.now(),
            key: socketId,
        };
        const toNotify: boolean =
            this.socketIds[socketId].indivUser.updateTimeLastSeen(socketId);

        // console.log('userId=' + userId + ' added to socket=' + socketId)
        return toNotify;
    }

    getIndivUserById(userId: number): IndivUser | null {
        if (userId === -1) return null;
        for (const elem of this.users) {
            if (elem.userId === userId) {
                return elem;
            }
        }
        return null;
    }

	getIndivUserBySocketId(socketId: string): IndivUser | null {
		if (this.socketIds[socketId])
			return this.socketIds[socketId].indivUser;
        return null;
    }

    async checkUserAlreadyHere(
        userId: number,
        socketId: string,
    ): Promise<ResponseCheckConnexion> {
        let toNotify: ResponseCheckConnexion = {
            inNotify: false,
            outNotify: false,
            outId: -1,
        };

        if (!this.socketIds[socketId]) {
            toNotify.inNotify = await this.addUserToSocket(userId, socketId);
        } else {
            //check if userId toujours le meme: oui=modifie date, non: modifie user
            if (this.socketIds[socketId].indivUser.userId === userId) {
                toNotify.inNotify =
                    this.socketIds[socketId].indivUser.updateTimeLastSeen(
                        socketId,
                    );
            } else {
                toNotify.outNotify = true;
                toNotify.outId = this.socketIds[socketId].indivUser.userId;
                toNotify.inNotify = await this.addUserToSocket(
                    userId,
                    socketId,
                );
            }
        }
        this.socketIds[socketId].lastPing = Date.now();
        return toNotify;
    }

    async handleDeconnexionCase(idUser: number) {
        for (const elem of this.users) {
            if (elem.userId === idUser) {
                const retour = await elem.checkStillConnected(null);
                return retour;
            }
        }
        return false;
    }

    removeUser(socketId: string) {
        for (let i = 0; i < this.users.length; i++) {
            this.users[i].checkSocketId(socketId);
        }
    }

    async checkConnections(): Promise<number[]> {
        let usersLeaving: number[] = []; //tableau de ID users a notifier
        const timeNow: number = Date.now();
        for (const elem of Object.values(this.socketIds)) {
            if (timeNow - elem.lastPing > 3000) {
                // console.log('disconnecting ? ' + elem.key);
                if (
                    (await elem.indivUser.checkStillConnected(elem.key)) ===
                    true
                ) {
                    // console.log('disconnecting = ' + elem.key);
                    usersLeaving.push(elem.indivUser.userId);
                }
                delete this.socketIds[elem.key];
            }
        }
        return usersLeaving;
    }
}

export class IndivUser {
    userId: number;
    isSignedIn: boolean;
    isConnected: boolean;
    isPlaying: boolean;
	idGamePlaying: string;
    sockets: string[];
    lastPingTime: number;

    constructor(
        userId: number,
        socketId: string,
        private prisma: PrismaService,
    ) {
        this.userId = userId;
        this.isConnected = false;
        this.isSignedIn = userId === -1 ? false : true;
        this.isPlaying = false;
		this.idGamePlaying = null;
        this.sockets = [socketId];
        this.lastPingTime = Date.now();
    }

    //return true if need to emit message
    async checkStillConnected(socketId: string | null): Promise<boolean> {
        const timeNow: number = Date.now();
        if (timeNow - this.lastPingTime > 3000) {
            this.isConnected = false;
            await this.updateStatusUserDB(false);
            return true;
        }
        return false;
    }

    async updateStatusUserDB(newStatus: boolean): Promise<boolean> {
        try {
            await this.prisma.user.update({
                where: { id: this.userId },
                data: { isConnected: newStatus },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    updateTimeLastSeen(socketId: string): boolean {
        let boolConnection: boolean = false;
        if (this.isConnected === false) {
            this.isConnected = true;
            this.updateStatusUserDB(true);
            boolConnection = true;
        }
        this.lastPingTime = Date.now();
        return boolConnection;
    }

    addNewSocketId(socketId: string): boolean {
        this.sockets.push(socketId);
        if (this.isConnected) return false;
        return true;
    }

    checkSocketId(socketId: string) {
        let check: number = -1;
        let i: number = 0;
        for (const elem of this.sockets) {
            if (socketId === elem) {
                check = i;
                break;
            }
            i++;
        }
        if (check !== -1) {
            this.sockets.splice(check, 1);
            return true;
        }
        return false;
    }

	setIsPlaying(gameId: string) {
		this.isPlaying = true;
		this.idGamePlaying = gameId;
	}
}
