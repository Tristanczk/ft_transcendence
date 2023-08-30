import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { FriendsModule } from './friends/friends.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GatewayModule } from './gateway/gateway.module';
import { StatsModule } from './stats/stats.module';
import { GamesModule } from './games/games.module';
import { CreateModule } from './create/create.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        PrismaModule,
        FriendsModule,
        GatewayModule,
        StatsModule,
        GamesModule,
        CreateModule,
    ],
    providers: [{
        provide: APP_INTERCEPTOR,
        useClass: ClassSerializerInterceptor}],
})
export class AppModule {}
