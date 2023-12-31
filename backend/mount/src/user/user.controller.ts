import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UploadedFile,
    UseInterceptors,
    Patch,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './middlewares/middlewaresImg';
import { Response } from 'express';
import { TwoFactorCodeDto } from 'src/auth/dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @UseGuards(JwtGuard)
    @Post('avatar')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async downloadAvatar(
        @GetUser('id') userId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.userService.downloadAvatar(userId, file);
    }

    @UseGuards(JwtGuard)
    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto,
        @Res() res: Response,
    ) {
        this.userService
            .editUser(userId, dto)
            .then(() => {
                res.send('User successfully updated!');
            })
            .catch((error: ForbiddenException) => {
                res.status(403).send(error.message);
            });
    }

    @UseGuards(JwtGuard)
    @Get('init-2fa')
    async enable2fa(@GetUser() user: User) {
        return this.userService.initTwoFactorAuthentication(user);
    }

    @UseGuards(JwtGuard)
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

    @UseGuards(JwtGuard)
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

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUserById(userId);
    }

    @Get('img/:id')
    async seeUploadedFile(
        @Param('id', ParseIntPipe) userId: number,
        @Res() res,
    ) {
        return this.userService.uploadAvatar(userId, res);
    }
}
