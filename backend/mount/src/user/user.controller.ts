import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './middlewares/middlewaresImg';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { Readable } from 'stream';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

	@Post('avatar')
	@UseInterceptors(
		FileInterceptor('image', {storage: diskStorage({destination: './files', filename: editFileName}),fileFilter: imageFileFilter}),
	)
	async downloadAvatar(@GetUser('id') userId: number, @UploadedFile() file: Express.Multer.File) {
		return this.userService.downloadAvatar(userId, file);
	}

	@Get('img/:id')
	async seeUploadedFile(@Param('id', ParseIntPipe) userId: number, @Res() res) {
		return this.userService.uploadAvatar(userId, res)
	}

	@Get('imga/')
	getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
		const file = createReadStream(join(process.cwd(), './files/bart-0dc7.png'));
		// res.set({
		// 'Content-Type': 'application/json',
		// 'Content-Disposition': 'attachment; filename="./files/bart-0dc7.png"',
		// });
		res.setHeader('Content-Type', 'image/*');
		res.setHeader('Content-Disposition', 'inline; filename="bart-0dc7.png"');
		// return this.userService.toStreamableFile(file);
		return new StreamableFile(Readable.from(file));
	}

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}
