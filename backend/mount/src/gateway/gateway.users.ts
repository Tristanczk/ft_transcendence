import { PrismaService } from 'src/prisma/prisma.service';
import { SocketProps } from './gateway.service';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';

type DefineTitle = {
	indivUser: IndivUser | null;
	lastPing: number;
	key: string;
}

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
    async addUserToSocket(userId: number, socketId: string) {
        let userToAdd: IndivUser | null = this.getIndivUserById(userId);
        if (!userToAdd) {
            //verif user
            let userIdVerified: number = -1;
            if (await this.verifUserId(userId)) userIdVerified = userId;

            //cree nouveau user et ajoute au tableau de users
            userToAdd = new IndivUser(userIdVerified, socketId, this.prisma);
            this.users.push(userToAdd);
            this.nbUsers += 1;
			console.log('create newUser: ' + userToAdd.userId)
        }
		else {
			userToAdd.addNewSocketId(socketId);
		}

		console.log('userToAdd:' + userToAdd.userId + ', ' + userToAdd.lastPingTime + ', sockets:');
		console.log(userToAdd.sockets)

        //ajoute au tableau de sockets
        this.socketIds[socketId] = {indivUser: userToAdd, lastPing: Date.now(), key: socketId};
		this.socketIds[socketId].indivUser.updateTimeLastSeen();
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

    checkUserAlreadyHere(userId: number, socketId: string) {
		// console.log('checkUserAlreadyHere: ' + userId + ', socket=' + socketId);
        if (!this.socketIds[socketId]) {
            this.addUserToSocket(userId, socketId);
        } else {
            //check if userId toujours le meme
            //si oui, modifie juste date apres PING
            //si non, on modifie le user
            if (this.socketIds[socketId].indivUser.userId === userId) {
                this.socketIds[socketId].indivUser.updateTimeLastSeen();
            } else {
				this.addUserToSocket(userId, socketId);
            }
        }
    }

    removeUser() {}

    checkConnections() {
		let usersLeaving: number[] = [];
		const timeNow: number = Date.now();
		for (const elem of Object.values(this.socketIds)) {
			if (timeNow - elem.lastPing > 3000) {
				console.log('disconnecting ? ' + elem.key)
				elem.indivUser.checkStillConnected()
				delete this.socketIds[elem.key]
			}
		}
	}
}

export class IndivUser {
    userId: number;
    isSignedIn: boolean;
	isConnected: boolean;
    isPlaying: boolean;
    sockets: string[];
    lastPingTime: number;

    constructor(userId: number, socketId: string, private prisma: PrismaService) {
        this.userId = userId;
        this.isSignedIn = userId === -1 ? false : true;
        this.isPlaying = false;
        this.sockets = [socketId];
        this.lastPingTime = Date.now();
    }

	//return true if need to emit message
    async checkStillConnected(): Promise<boolean> {
		// if (this.isConnected === false) return false;
        const timeNow: number = Date.now();
		if (timeNow - this.lastPingTime > 3000) {
			this.isConnected = false;
			this.updateStatusUserDB(false);
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

    updateTimeLastSeen() {
		if (this.isConnected === false) {
			this.isConnected = true;
			this.updateStatusUserDB(true);
		}
        this.lastPingTime = Date.now();
    }

	addNewSocketId(socketId: string) {
		this.sockets.push(socketId);
	}
}
