import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import * as argon from 'argon2';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies[config.get('JWT_REFRESH_TOKEN_COOKIE')];
                },
            ]),
            secretOrKey: config.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: { sub: number; login: string }) {
        const refreshToken =
            req.cookies[this.config.get('JWT_REFRESH_TOKEN_COOKIE')];
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        // TODO check if user is null
        const valid = await argon.verify(
            user.currentHashedRefreshToken,
            refreshToken,
        );
        if (valid) {
            return user;
        } else {
            throw new ForbiddenException('Invalid refresh token');
        }
    }
}
