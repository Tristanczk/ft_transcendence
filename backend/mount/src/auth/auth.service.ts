import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import { Response } from 'express';
import { SigninDto, SignupDto } from './dto';

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

    async upsertUser(login: string, email: string): Promise<User> {
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
                data: {
                    login: login,
                    nickname: login,
                    email: email,
                    elo: 1000,
                    loginNb: 1,
                },
            });
            return newUser;
        }
    }

    async signin42(code: string, res: Response): Promise<AccessToken> {
        try {
            const first = await axios.post(
                'https://api.intra.42.fr/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: this.config.get('REACT_APP_API42_UID'),
                    client_secret: this.config.get('API42_SECRET'),
                    code: code,
                    redirect_uri: 'http://localhost:3000/signin42',
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
            const email: string = second.data['email'];
            const user = await this.upsertUser(login, email);
            const jwtToken = await this.signToken(user.id, user.login);
            res.cookie(this.config.get('JWT_COOKIE'), jwtToken.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return jwtToken;
        } catch (error) {
            console.log('signin42', error);
            return { accessToken: '' };
        }
    }

    async signup(dto: SignupDto, res: Response): Promise<AccessToken> {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    login: dto.nickname,
                    nickname: dto.nickname,
                    email: dto.email,
                    elo: 1000,
                    loginNb: 1,
                    hash,
                },
            });
            const jwtToken = await this.signToken(user.id, user.login);
            res.cookie(this.config.get('JWT_COOKIE'), jwtToken.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            return jwtToken;
        } catch (error) {
            console.log('signup', error);
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials already exists');
                }
            }
            throw error;
        }
    }

    async signin(dto: SigninDto, res: Response): Promise<AccessToken> {
        // find the user by nickname
        // throw an exception if the user is not found
        const user = await this.prisma.user.findUnique({
            where: {
                nickname: dto.nickname,
            },
        });
        if (!user) {
            throw new ForbiddenException('No account linked with this email');
        }
        const updatedUser = await this.prisma.user.update({
            where: { nickname: dto.nickname },
            data: { loginNb: user.loginNb + 1 },
        });
        const pwMatches = await argon.verify(user.hash, dto.password);

        // compare the password hash with the password hash in the database
        // throw an exception if the password is incorrect
        if (!pwMatches) {
            throw new ForbiddenException('Incorrect password');
        }
        const jwtToken = await this.signToken(user.id, user.login);
        res.cookie(this.config.get('JWT_COOKIE'), jwtToken.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return jwtToken;
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
