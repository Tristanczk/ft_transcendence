import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { TwoFactorCodeDto } from 'src/auth/dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

	// return the list of all users
	@Get() 
	getAllUsers() {
		return this.userService.getAllUsers()
	}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }

    @Get('init-2fa')
    async enable2fa(@GetUser() user: User) {
        return this.userService.initTwoFactorAuthentication(user);
    }

    @Post('enable-2fa')
    async enable2faPost(
        @GetUser() user: User,
        @Body() dto: TwoFactorCodeDto,
        @Res() res: Response,
    ) {
        this.userService
            .enableTwoFactorAuthentication(user, dto.code)
            .then(() => {
                res.send('Two-Factor authentification successfully enabled!');
            })
            .catch((error: UnauthorizedException) => {
                res.status(401).send(error.message);
            });
    }

    @Post('disable-2fa')
    async disable2fa(
        @GetUser() user: User,
        @Body() dto: TwoFactorCodeDto,
        @Res() res: Response,
    ) {
        this.userService
            .disableTwoFactorAuthentication(user, dto.code)
            .then(() => {
                res.send('Two-Factor authentification successfully disabled!');
            })
            .catch((error: UnauthorizedException) => {
                res.status(401).send(error.message);
            });
    }
}
