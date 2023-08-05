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

    @Get('signin/42')
    signin(@Query() params: any, @Res() res: Response) {
        this.authService
            .signin42(params.code, res)
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
