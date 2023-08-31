import { Injectable } from "@nestjs/common";
import { Games, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AchievementService {
	constructor(private prisma: PrismaService) {}



}
