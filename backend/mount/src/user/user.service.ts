import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { GetAllUsersResponseDto } from './dto/get-all-users.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId: number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...dto,
            },
        });
        return user;
    }

	async getAllUsers(): Promise<GetAllUsersResponseDto[]> {
		const users = await this.prisma.user.findMany();
		console.log(users)
		return new GetAllUsersResponseDto(users)
	}
}
