import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcademicsModule } from './academics/academics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => {
                return {
                    stores: [
                        createKeyv(process.env.REDIS_CACHE)
                    ]
                }
            }
        }),
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 10 }] }),
        AuthModule,
        UsersModule,
        AcademicsModule,
        CloudinaryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
