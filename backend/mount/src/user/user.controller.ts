import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './middlewares/middlewaresImg';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    // @Get('id/:id')
    // getUserById(@Param('id', ParseIntPipe) userId: number) {
    //     return user;
    // }

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

    @Get('img/:id')
    async seeUploadedFile(
        @Param('id', ParseIntPipe) userId: number,
        @Res() res,
    ) {
        return this.userService.uploadAvatar(userId, res);
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
