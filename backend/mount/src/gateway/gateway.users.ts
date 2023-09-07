import { PrismaService } from 'src/prisma/prisma.service';
import { HandlePingProp, SocketProps } from './gateway.service';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

type DefineTitle = {
    indivUser: IndivUser | null;
    lastPing: number;
    key: string;
};

export class Users {
    users: IndivUser[];
    private nbUsers: number;
    private socketIds: Record<string, DefineTitle> = {};

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
            console.log('create newUser: ' + userToAdd.userId);
        } else {
            userToAdd.addNewSocketId(socketId);
        }

        console.log(
            'userToAdd:' +
                userToAdd.userId +
                ', ' +
                userToAdd.lastPingTime +
                ', sockets:',
        );
        console.log(userToAdd.sockets); 

        //ajoute au tableau de sockets
        this.socketIds[socketId] = {
            indivUser: userToAdd,
            lastPing: Date.now(),
            key: socketId,
        };
        const toNotify: boolean =
            this.socketIds[socketId].indivUser.updateTimeLastSeen(socketId);

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

    async checkUserAlreadyHere(
        userId: number,
        socketId: string,
    ): Promise<boolean> {
        // console.log('checkUserAlreadyHere: ' + userId + ', socket=' + socketId);
        let toNotify: boolean = false;
        if (!this.socketIds[socketId]) {
            toNotify = await this.addUserToSocket(userId, socketId);
        } else {
            //check if userId toujours le meme: oui=modifie date, non: modifie user
            if (this.socketIds[socketId].indivUser.userId === userId) {
                toNotify =
                    this.socketIds[socketId].indivUser.updateTimeLastSeen(socketId);
                    console.log('still ' + userId + ', socket=' + socketId)
            } else {
                toNotify = await this.addUserToSocket(userId, socketId);
            }
        }
        this.socketIds[socketId].lastPing = Date.now();
        return toNotify;
    }

    removeUser() {}

    checkConnections(): number[] {
        let usersLeaving: number[] = []; //tableau de ID users a notifier
        const timeNow: number = Date.now();
        for (const elem of Object.values(this.socketIds)) {
            if (timeNow - elem.lastPing > 3000) {
                console.log('disconnecting ? ' + elem.key);
                if (elem.indivUser.checkStillConnected(elem.key) === true) {
                    console.log('disconnecting = ' + elem.key);
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
        this.sockets = [socketId];
        this.lastPingTime = Date.now();
    }

    //return true if need to emit message
    checkStillConnected(socketId: string): boolean {
        // if (this.isConnected === false) return false;
        const timeNow: number = Date.now();
        console.log('isconnected ' + this.userId + ', date=' + this.lastPingTime + ' vs now=' + timeNow + ' diff=' + (timeNow - this.lastPingTime))

        if (timeNow - this.lastPingTime > 3000) {
            this.isConnected = false;
            this.updateStatusUserDB(false);
            // this.sockets
            console.log('non')
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
        // this.sockets[socketId] = Date.now();
        return boolConnection;
    }

    addNewSocketId(socketId: string): boolean {
        this.sockets.push(socketId); //] = Date.now();
        if (this.isConnected) return false;
        return true;
    }
}
