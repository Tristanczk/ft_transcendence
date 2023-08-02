import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService) { }

	async signup(dto: AuthDto) {
		// generate password hash from password user
		// await stops the execution until the promise is resolved (accepted or rejected)
		const hash = await argon.hash(dto.password)
		// save the new user in the database
		// using await makes it an asynchronous operation, 
		// justifying the use of an async function
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,
				},
			})
			// allows to delete the hast from the user object
			// before returning it so that it isn't visible in the http response
			// however, it is still saved in the database when the user is created
			return this.signToken(user.id, user.email);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials already exists')
				}
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		// find the user by email
		// throw an exception if the user is not found
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) {
			throw new ForbiddenException('No account linked with this email');
		}

		const pwMatches = await argon.verify(user.hash, dto.password);

		// compare the password hash with the password hash in the database
		// throw an exception if the password is incorrect
		if (!pwMatches) {
			throw new ForbiddenException('Incorrect password');
		};
		return this.signToken(user.id, user.email);
	}

	async signToken(userId: number, email: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email
		}
		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: secret,
		})
		return {
			access_token: token,
		};
	}

	async AuthorizeUrl42() {
		const uid = this.config.get('API42_UID');
		return (`https://api.intra.42.fr/oauth/authorize?client_id=${uid}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsignin&response_type=code`);
	}
}