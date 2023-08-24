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
