import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req?.cookies?.[
                        config.get('JWT_ACCESS_TOKEN_COOKIE')
                    ];
                },
            ]),
            secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: { sub: number; login: string }) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub,
                },
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}
