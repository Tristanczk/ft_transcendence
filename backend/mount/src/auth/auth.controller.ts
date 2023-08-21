import {
    Controller,
    Get,
    Query,
    Res,
    Req,
    UnauthorizedException,
    Post,
    Body,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as assert from 'assert';
import { SignupDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
        private config: ConfigService,
    ) {}

    @Get('signin/42')
    signin42(@Query() params: any, @Res() res: Response) {
        this.authService
            .signin42(params.code, res)
            .then((jwt) => {
                if (jwt.accessToken !== '') {
                    res.send('Successfully signed in!');
                } else {
                    res.status(400).send(
                        'Could not sign in with 42 authtentication',
                    );
                }
            })
            .catch(() => {
                res.status(500).send('Internal server error');
            });
    }

    @Get('signout')
    signout(@Res() res: Response) {
        if (this.authService.signout(res)) res.send('Successfully signed out!');
        else res.status(500).send('Internal server error');
    }

    @Post('signup')
    signup(@Body() dto: SignupDto, @Res() res: Response) {
        this.authService
            .signup(dto, res)
            .then(() => {
                res.send('Successfully signed up!');
            })
            .catch((error) => {
                res.status(401).send(error.message);
            });
    }

    @Post('signin')
    signin(@Body() dto: SigninDto, @Res() res: Response) {
        this.authService
            .signin(dto, res)
            .then(() => {
                res.send('Successfully signed in!');
            })
            .catch((error: ForbiddenException) => {
                res.status(401).send(error.message);
            });
    }
}
