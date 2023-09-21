import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import { Response } from 'express';
import { SigninDto, SignupDto } from './dto';
import { authenticator } from 'otplib';
import { GatewayService } from 'src/gateway/gateway.service';

type JWTToken = { JWTToken: string };

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private gateway: GatewayService,
    ) {}

    async signToken(
        userId: number,
        login: string,
        access: boolean,
    ): Promise<JWTToken> {
        const payload = {
            sub: userId,
            login,
        };
        if (access) {
            const JWTToken = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get('JWT_ACCESS_TOKEN_DURATION'),
                secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
            });
            return { JWTToken };
        } else {
            const JWTToken = await this.jwt.signAsync(payload, {
                expiresIn: this.config.get('JWT_REFRESH_TOKEN_DURATION'),
                secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
            });
            return { JWTToken };
        }
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
                    avatarPath: 'default.png',
                    elo: 1000,
					highElo: 1000,
                    loginNb: 1,
                },
            });
            return newUser;
        }
    }

    async generateTokens(user: User, res: Response) {
        const accessToken = await this.signToken(user.id, user.login, true);
        res.cookie(
            this.config.get('JWT_ACCESS_TOKEN_COOKIE'),
            accessToken.JWTToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            },
        );
        const refreshToken = await this.signToken(user.id, user.login, false);
        res.cookie(
            this.config.get('JWT_REFRESH_TOKEN_COOKIE'),
            refreshToken.JWTToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            },
        );
        const hash = await argon.hash(refreshToken.JWTToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { currentHashedRefreshToken: hash },
        });
    }

    async signin42(code: string, res: Response): Promise<User> {
        try {
            const first = await axios.post(
                'https://api.intra.42.fr/oauth/token',
                {
                    grant_type: 'authorization_code',
                    client_id: this.config.get('REACT_APP_API42_UID'),
                    client_secret: this.config.get('API42_SECRET'),
                    code: code,
                    redirect_uri: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/signin42`,
                },
                { headers: { 'Content-Type': 'application/json' } },
            );
            if (!first.data['access_token']) {
                throw new ForbiddenException('Invalid credentials');
            }
            const bearerToken: string = first.data['access_token'];
            const second = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${bearerToken}` },
            });
            if (!second.data['login'] || !second.data['email']) {
                throw new ForbiddenException('Invalid credentials');
            }
            const login: string = second.data['login'];
            const email: string = second.data['email'];
            const user = await this.upsertUser(login, email);
            user.hash = undefined;
            user.twoFactorSecret = undefined;
            if (user.twoFactorAuthentication) {
                return user;
            }
            await this.generateTokens(user, res);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async signup(dto: SignupDto, res: Response): Promise<User> {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    login: dto.nickname,
                    nickname: dto.nickname,
                    email: dto.email,
                    avatarPath: 'default.png',
                    elo: 1000,
					highElo: 1000,
                    loginNb: 1,
                    hash,
                },
            });
            await this.generateTokens(user, res);
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    if (error.meta.target[0] === 'login')
                        throw new ForbiddenException('Nickname already exists');
                    else if (error.meta.target[0] === 'email')
                        throw new ForbiddenException('Email already exists');
                    else throw new ForbiddenException('Invalid credentials');
                }
            }
            throw error;
        }
    }

    async signin(dto: SigninDto, res: Response): Promise<User> {
        // find the user by nickname
        // throw an exception if the user is not found
        const user = await this.prisma.user.findUnique({
            where: {
                nickname: dto.nickname,
            },
        });
        if (!user) {
            throw new ForbiddenException('Wrong credentials provided');
        }
        const pwMatches = await argon.verify(user.hash, dto.password);

        // compare the password hash with the password hash in the database
        // throw an exception if the password is incorrect
        if (!pwMatches) {
            throw new ForbiddenException('Wrong credentials provided');
        }
        user.hash = undefined;
        user.twoFactorSecret = undefined;
        if (user.twoFactorAuthentication) {
            return user;
        }
        await this.prisma.user.update({
            where: { nickname: dto.nickname },
            data: { loginNb: user.loginNb + 1 },
        });
        await this.generateTokens(user, res);
        return user;
    }
    
    async signout(userId: number, res: Response): Promise<void> {
        try {
            const user = this.gateway.users.getIndivUserById(userId);
            if (user) {
                user.sockets.forEach((socket) => {
                    this.gateway.server.to(socket).emit('signoutchat');
                });
            }
            
            res.clearCookie(this.config.get('JWT_ACCESS_TOKEN_COOKIE'), {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
            res.clearCookie(this.config.get('JWT_REFRESH_TOKEN_COOKIE'), {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            });
            await this.prisma.user.update({
                where: { id: userId },
                data: { currentHashedRefreshToken: null },
            });

        } catch (error) {
            throw error;
        }
    }

    async authenticateTwoFactor(nickname: string, code: string, res: Response) {
        const user = await this.prisma.user.findUnique({
            where: {
                nickname,
            },
        });
        if (!user) {
            throw new ForbiddenException('Wrong credentials provided');
        }

        const isCodeValid = authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });
        if (!isCodeValid) {
            throw new ForbiddenException('Wrong authentication code');
        }
        await this.prisma.user.update({
            where: { nickname },
            data: { loginNb: user.loginNb + 1 },
        });
        await this.generateTokens(user, res);
        return user;
    }

    async refreshTokens(user: User, res: Response) {
        const accessToken = await this.signToken(user.id, user.login, true);
        res.cookie(
            this.config.get('JWT_ACCESS_TOKEN_COOKIE'),
            accessToken.JWTToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            },
        );
    }
}
