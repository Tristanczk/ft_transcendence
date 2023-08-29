import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InitGameDto } from './dto/init-game.dto';
import { updateGameDto } from './dto/update-game.dto';
import { GameExports, UserGame } from './games.types';

@Injectable()
export class GamesService {
	constructor(private prisma: PrismaService) {}

	async initGame(idUser: number, idPlayerB: number, mode: number) {
		console.log('initGame ' + idUser + ' against ' + idPlayerB)
		//verif playerB exist
		const playerB = await this.prisma.user.findUnique({where: {id: idPlayerB}})
		if (!playerB) throw new NotFoundException();

		//creating game
		try {
			const newGame = await this.prisma.games.create({
				data: {
					finished: false,
					finishedAt: new Date(),
					won: true,
					scoreA: 0,
					scoreB: 0,
					mode: mode,
					UserA: {connect: {id: idUser}},
					UserB: {connect: {id: idPlayerB}},
				}, 
			});
			return newGame.id;
		}
		catch (error) {
			console.log(error);
			throw new ConflictException('Could not create game')
		}
	}

	async updateGame(idGame: number, body: updateGameDto) {
		console.log('updateGame ' + idGame + ' result ' + body)
		const retour = await this.prisma.games.update({
			where: {id: idGame},
			data: {
				finished: true,
				finishedAt: new Date(),
				scoreA: body.scoreA,
				scoreB: body.scoreB,
				won: body.won,
			}
		})
		return retour;
	}

	async historyFiveGames(userId: number) {
		const data = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				gamesasPlayerA: true,
				gamesasPlayerB: true,
			}
		})
		if (!data) throw new NotFoundException('No user found')

		const gameList = data.gamesasPlayerA.concat(data.gamesasPlayerB)
		gameList.sort((a, b) => a.id - b.id)
		// console.log(userId + ' : A=' + data.gamesasPlayerA.length + ', B=' + data.gamesasPlayerB.length + ', tot=' + gameList.length)

		let newGameList = [];
		if (gameList.length <= 5) newGameList = gameList;
		else newGameList = gameList.slice(-5);

		const transformedTab = this.transformListReadable(newGameList);

		return transformedTab;
	}

	async transformListReadable(tab: any) {
		const tabId: number[] = [];
		tab.forEach(element => {
			if (!tabId.includes(element.playerA)) {
				tabId.push(element.playerA)
			}
			if (!tabId.includes(element.playerB)) {
				tabId.push(element.playerB)
			}
		});

		const users = await this.prisma.user.findMany({ where:{
			id: {
				in: tabId
			}
		}});

		let transformedTab: GameExports[] = [];
		tab.forEach(elem => {
			let newElem: GameExports = {gameId: -1, duration: 0, mode: 0, playerA: null, playerB: null};
			newElem.gameId = elem.id;
			newElem.mode = elem.mode;
			newElem.playerA = this.getUserFormat(elem.playerA, users, elem.scoreA)
			newElem.playerB = this.getUserFormat(elem.playerB, users, elem.scoreB)
			transformedTab.push(newElem)	
		})
		return transformedTab;
	}

	getUserFormat(userId: number, users: any, score: number): UserGame {
		let formatedUser: UserGame = {id: -1, nickname: '', elo: 0, score: 0};
		const user = users.find((user) => user.id === userId);

		formatedUser.id = userId;
		formatedUser.nickname = user.nickname;
		formatedUser.elo = user.elo;
		formatedUser.score = score;
		return formatedUser;
	}

}
