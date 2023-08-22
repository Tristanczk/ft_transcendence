import {
    Controller,
    Get,
    Query,
    Res,
    Req,
    UnauthorizedException,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as assert from 'assert';
import { SignupDto, SigninDto } from './dto';
import { GetUser } from './decorator';
import { GatewayService } from 'src/gateway/gateway.service';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private prisma: PrismaService,
        private config: ConfigService,
        private gatewayService: GatewayService,
    ) {}

    @Get('signin/42')
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
            .catch(() => {
                res.status(500).send('Something went wrong');
            });
    }

    @UseGuards(JwtGuard)
    @Get('signout')
    signout(@Res() res: Response, @GetUser('id') userId: number) {
        if (this.authService.signout(res, userId)) res.send('Successfully signed out!');
        else res.status(500).send('Something went wrong');
    }

    @Post('signup')
    signup(@Body() dto: SignupDto, @Res() res: Response) {
        this.authService
            .signup(dto, res)
            .then((jwt) => {
                if (jwt.accessToken !== '') {
                    res.send('Successfully signed up!');
                } else {
                    res.status(400).send('Sign up failed');
                }
            })
            .catch(() => {
                res.status(500).send('Something went wrong');
            });
    }

    @Post('signin')
    signin(@Body() dto: SigninDto, @Res() res: Response) {
        this.authService
            .signin(dto, res)
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
}
