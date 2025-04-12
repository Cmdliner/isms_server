import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { GuardiansModule } from './guardians/guardians.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        StudentsModule,
        TeachersModule,
        GuardiansModule,
        AdminModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
