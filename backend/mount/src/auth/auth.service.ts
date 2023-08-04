import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from '@prisma/client';
import { Response } from 'express';

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
        return { accessToken };
    }

    async upsertUser(login: string): Promise<User> {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                login: login,
            },
        });
        if (existingUser) {
            const updatedUser = await this.prisma.user.update({
                where: { login },
                data: { loginNb: existingUser.loginNb + 1 },
            });
            return updatedUser;
        } else {
            const newUser = await this.prisma.user.create({
                data: { login: login, nickname: login, elo: 1000, loginNb: 1 },
            });
            return newUser;
        }
    }

    async signin(code: string, res: Response): Promise<AccessToken> {
        try {
            const first = await axios.post(
                'https://api.intra.42.fr/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: this.config.get('REACT_APP_API42_UID'),
                    client_secret: this.config.get('API42_SECRET'),
                    code: code,
                    redirect_uri: 'http://localhost:3000/signin',
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            if (!first.data['access_token']) {
                return { accessToken: '' };
            }
            const bearerToken: string = first.data['access_token'];
            const second = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${bearerToken}` },
            });
            if (!second.data['login']) {
                return { accessToken: '' };
            }
            const login: string = second.data['login'];
            const user = await this.upsertUser(login);
            const jwtToken = await this.signToken(user.id, user.login);
            res.cookie(this.config.get('JWT_COOKIE'), jwtToken.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return jwtToken;
        } catch (error) {
            console.log('signin', error);
            return { accessToken: '' };
        }
    }

    signout(res: Response): boolean {
        try {
            res.clearCookie(this.config.get('JWT_COOKIE'), {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return true;
        } catch (error) {
            console.log('signout', error);
            return false;
        }
    }
}
