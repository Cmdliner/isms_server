import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UsersModule, JwtModule],
    providers: [StudentsService],
    controllers: [StudentsController]
})
export class StudentsModule { }
