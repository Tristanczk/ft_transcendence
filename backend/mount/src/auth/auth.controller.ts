import {
    Controller,
    Get,
    Query,
    Res,
    Post,
    Body,
    ForbiddenException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto, SigninDto, TwoFactorCodeDto } from './dto';
import { JwtGuard, JwtRefreshGuard } from './guard';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

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
            .then((user) => {
                if (user.twoFactorAuthentication) {
                    res.json({
                        message: 'Two-Factor authentication required',  
                        user,
                    });
                } else {
                    res.json({
                        message: 'Successfully signed in!',
                        user,
                    });
                }
            })
            .catch((error) => {
                res.status(401).send(error.message);
            });
    }

    @UseGuards(JwtGuard)
    @Get('signout')
    signout(@GetUser('id') userId: number, @Res() res: Response) {
        this.authService
            .signout(userId, res)
            .then(() => {
                res.send('Successfully signed out!');
            })
            .catch((error) => {
                res.status(500).send('Internal server error');
            });
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
            .then((user) => {
                if (user.twoFactorAuthentication) {
                    res.json({
                        message: 'Two-Factor authentication required',
                        user,
                    });
                } else {
                    res.json({
                        message: 'Successfully signed in!',
                        user,
                    });
                }
            })
            .catch((error: ForbiddenException) => {
                res.status(401).send(error.message);
            });
    }

    @Post('authenticate-2fa')
    async authenticate2fa(@Body() dto: TwoFactorCodeDto, @Res() res: Response) {
        this.authService
            .authenticateTwoFactor(dto.nickname, dto.code, res)
            .then((user) => {
                res.json({
                    message: 'Two-Factor authentification successful',
                    user,
                });
            })
            .catch((error: ForbiddenException) => {
                res.status(401).send(error.message);
            });
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@GetUser() user: User, @Res() res: Response) {
        this.authService
            .refreshTokens(user, res)
            .then((user) => {
                res.json({
                    message: 'Successfully refreshed token!',
                    user,
                });
            })
            .catch((error) => {
                res.status(401).send(error.message);
            });
    }
}
