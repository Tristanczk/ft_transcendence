import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: (req) => {
                return req.cookies[config.get('JWT_ACCESS_TOKEN_COOKIE')];
            },
            secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: { sub: number; login: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        return user;
    }
}
