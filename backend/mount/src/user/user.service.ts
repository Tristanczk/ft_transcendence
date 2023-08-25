import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { User } from '@prisma/client';

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
    async getAllUsers() {
        console.log('bonjour');
        const users = await this.prisma.user.findMany();
        console.log(users);
        return users;
    }

    async initTwoFactorAuthentication(
        user: User,
    ): Promise<{ qrCode: string; secret: string }> {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(
            user.login,
            'lipong.org',
            secret,
        );
        this.editUser(user.id, { twoFactorSecret: secret });
        const qrCode = await toDataURL(otpauthUrl);
        // console.log(qrCode);
        return { qrCode, secret };
    }

    async enableTwoFactorAuthentication(user: User, code: string) {
        const isCodeValid = authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        this.editUser(user.id, { twoFactorAuthentication: true });
    }

    async disableTwoFactorAuthentication(user: User, code: string) {
        const isCodeValid = authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        this.editUser(user.id, {
            twoFactorAuthentication: false,
            twoFactorSecret: null,
        });
    }
}
