import { Injectable, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId: number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        return user;
    }

	async downloadAvatar(userId: number, file: Express.Multer.File) {
		console.log(file);
		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		if (file.filename) {
			const user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					avatarPath: file.filename ?? '',
				},
			});
		}
		return response;
	}

	// toStreamableFile(data: Buffer): StreamableFile {
	// 	return new StreamableFile(Readable.from(data));
	//   }
	
	async uploadAvatar(userId: number, res: any) {
		const userImg = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		})


		if (!userImg)
			return 'error'
		console.log('user('+userId+'):')
		console.log(userImg)

		// let blob = new Blob([userImg.avatarPath], {type: 'image/png'});

		// const link = URL.createObjectURL(blob);

		// console.log(link)

		// return link;
		return res.sendFile(userImg.avatarPath, { root: './files' });

		

		// const imagePath = `./files/${userImg.avatarPath}`;

		// try {
		// 	const data = await fs.promises.readFile(imagePath);
		// 	const base64Image = Buffer.from(data).toString('base64');
		// 	const imageDataUrl = `data:image/png;base64,${base64Image}`;
		
		// 	return res.status(200).json({ imageDataUrl });
		//   } catch (error) {
		// 	console.error(error);
		// 	return res.status(500).json({ error: 'Error reading image file' });
		//   }

	}
}
