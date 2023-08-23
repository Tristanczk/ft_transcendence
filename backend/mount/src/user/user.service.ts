import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

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
        // console.log(file);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        if (file.filename) {
            await this.prisma.user.update({
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

    async uploadAvatar(userId: number, res: any) {
        const userImg = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!userImg) return 'error';

        return res.sendFile(userImg.avatarPath, { root: './files' });
    }

    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    }
}
