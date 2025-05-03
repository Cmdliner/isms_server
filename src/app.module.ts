import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { AcademicsModule } from './academics/academics.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 10 }] }),
        AuthModule,
        UsersModule,
        AcademicsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
