import {
    Controller,
    Get,
    Query,
    Res,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as assert from 'assert';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
        private config: ConfigService,
    ) {}

    //TODO : no business logic in controller, should be in service + jwt guard and strategy should be responsible to check if user is authenticated no need to do it in business logic, use decorators
    @Get('get-user-info')
    async getUserInfo(@Req() req: Request) {
        try {
            const cookie = req.cookies[this.config.get('JWT_COOKIE')] as string;
            if (!cookie) {
                throw new UnauthorizedException('No authorization token found');
            }
            const jwtPayload = jwt.verify(cookie, process.env.JWT_SECRET);
            assert(typeof jwtPayload !== 'string');
            const user = await this.prisma.user.findUnique({
                where: { login: jwtPayload.login },
            });
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid authorization token');
        }
    }

    @Get('signin')
    signin(@Query() params: any, @Res() res: Response) {
        this.authService
            .signin(params.code, res)
            .then((jwt) => {
                if (jwt.accessToken !== '') {
                    res.send('Successfully signed in!');
                } else {
                    res.status(400).send('Sign in failed');
                }
            })
            .catch(() => {
                res.status(500).send('Something went wrong');
            });
    }

    @Get('signout')
    signout(@Res() res: Response) {
        if (this.authService.signout(res)) res.send('Successfully signed out!');
        else res.status(500).send('Something went wrong');
    }
}
