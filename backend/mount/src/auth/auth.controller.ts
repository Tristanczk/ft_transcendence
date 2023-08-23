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
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto, SigninDto, TwoFactorCodeDto } from './dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { use } from 'passport';
import { JwtGuard } from './guard';

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
    async enable2faPost(@Body() dto: TwoFactorCodeDto, @Res() res: Response) {
        this.authService
            .authenticateTwoFactor(dto.nickname, dto.code, res)
            .then(() => {
                res.send('Two-Factor authentification successful');
            })
            .catch((error) => {
                res.status(401).send(error.message);
            });
    }
}
