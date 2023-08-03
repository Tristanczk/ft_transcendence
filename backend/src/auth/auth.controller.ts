import {
    Controller,
    Get,
    Query,
    Res,
    Req,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import * as assert from 'assert';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
    ) {}

    @Get('get-user-info')
    async getUserInfo(@Req() req: Request) {
        try {
            // TODO get cookie better
            const cookie = req.headers['cookie'].slice(4);
            if (!cookie) {
                throw new UnauthorizedException('No authorization token found');
            }
            const jwtPayload = jwt.verify(cookie, process.env.JWT_SECRET);
            assert(typeof jwtPayload !== 'string'); // TODO very fishy
            const user = await this.prisma.user.findUnique({
                where: { login: jwtPayload.login },
            });
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid authorization token');
        }
    }

    @Get('signin')
    signin42(@Query() params: any, @Res() res: Response) {
        this.authService
            .signin42(params.code, res)
            .then((jwt) => {
                if (jwt.accessToken !== '') {
                    res.send('Successfully signed in!');
                } else {
                    res.status(400).send('Sign in failed');
                }
            })
            .catch((error) => {
                res.status(500).send('Something went wrong');
            });
    }
}
