import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from '@prisma/client';

type AccessToken = { accessToken: string };

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) {}

    async signToken(userId: number, login: string): Promise<AccessToken> {
        const payload = {
            sub: userId,
            login,
        };
        const secret = this.config.get('JWT_SECRET');
        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '1d',
            secret: secret,
        });
        return {
            accessToken,
        };
    }

    async upsertUser(login: string): Promise<User> {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ login: login }],
            },
        });

        if (existingUser) {
            ++existingUser.loginNb;
            return existingUser;
        } else {
            const newUser = await this.prisma.user.create({
                data: {
                    login: login,
                    nickName: login,
                    elo: 1000,
                    loginNb: 1,
                },
            });
            return newUser;
        }
    }

    async signin42(code: string): Promise<AccessToken> {
        try {
            const res = await axios.post(
                'https://api.intra.42.fr/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: this.config.get('API42_UID'),
                    client_secret: this.config.get('API42_SECRET'),
                    code: code,
                    redirect_uri: 'http://localhost:3000/signin',
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            const token: string = res.data['access_token'];
            const me = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!me.data['login']) {
                return { accessToken: '' };
            }
            const login: string = me.data['login'];
            const user = await this.upsertUser(login);
            return this.signToken(user.id, user.login);
        } catch (error) {
            return { accessToken: '' };
        }
    }
}
