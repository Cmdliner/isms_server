import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { GuardiansModule } from './guardians/guardians.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 10 }] }),
        StudentsModule,
        TeachersModule,
        GuardiansModule,
        AdminModule,
        AuthModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
