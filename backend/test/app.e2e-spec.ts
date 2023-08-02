import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {

	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({
			whitelist: true,
		}));
		await app.init();
		await app.listen(3333);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();

		pactum.request.setBaseUrl('http://localhost:3333');
	});
	afterAll(() => {
		app.close();
	});
	describe('Auth', () => {
		const dto: AuthDto = {
			email: 'test@gmail.com',
			password: '123'
		}
		describe('Signup', () => {
			// {...dto, email: ''} is a spread syntax, it takes all the values of dto and copies it to a new object, then it overrides the email value
			it('should throw if email is empty', () => {
				return pactum.spec().post('/auth/signup').withBody({ ...dto, email: '' }).expectStatus(400);
			});
			it('should throw if password is empty', () => {
				return pactum.spec().post('/auth/signup').withBody({ ...dto, password: '' }).expectStatus(400);
			});
			it('should throw if no body provided', () => {
				return pactum.spec().post('/auth/signup').expectStatus(400);
			});
			it('should signup', () => {
				return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
			});
		});

		describe('Signin', () => {
			it('should throw if email is empty', () => {
				return pactum.spec().post('/auth/signin').withBody({ ...dto, email: '' }).expectStatus(400);
			});
			it('should throw if password is empty', () => {
				return pactum.spec().post('/auth/signin').withBody({ ...dto, password: '' }).expectStatus(400);
			});
			it('should throw if no body provided', () => {
				return pactum.spec().post('/auth/signin').expectStatus(400);
			});
			it('should signin', () => {
				return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userAt', 'access_token'); // stores the access_token in the userAt variable
			});
		});
	});

	describe('User', () => {
		describe('Get me', () => {
			it('should get current user', () => {
				return pactum.spec().get('/users/me').withHeaders({ Authorization: 'Bearer $S{userAt}' }).expectStatus(200).inspect();
			});
		});

		describe('Edit user', () => {
			it('should edit user', () => {
				const dto: EditUserDto = {
					firstName: 'heyitsme',
					email: 'testchanged@gmail.com'
				};
				return pactum.spec().patch('/users').withHeaders({ Authorization: 'Bearer $S{userAt}' }).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email);
			});
		});
	});

	describe('Bookmarks', () => {
		describe('Create bookmark', () => { });

		describe('Get bookmarks', () => { });

		describe('Get bookmark by id', () => { });

		describe('Edit bookmark', () => { });

		describe('Delete bookmark', () => { });
	});
});
