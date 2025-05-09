import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardiansController } from './controllers/guardians.controller';
import { StudentsController } from './controllers/students.controller';
import { TeachersController } from './controllers/teachers.controller';
import { Guardian, GuardianSchema } from './schemas/discriminators/guardian.schema';
import { Student, StudentSchema } from './schemas/discriminators/student.schema';
import { Teacher, TeacherSchema } from './schemas/discriminators/teacher.schema';
import { User, UserSchema } from './schemas/user.schema';
import { GuardiansService } from './services/guardians.service';
import { StudentsService } from './services/students.service';
import { TeachersService } from './services/teachers.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
                discriminators: [
                    { name: Student.name, schema: StudentSchema },
                    { name: Teacher.name, schema: TeacherSchema },
                    { name: Guardian.name, schema: GuardianSchema }
                ]
            }
        ]),
        JwtModule
    ],
    providers: [
        UsersService,
        StudentsService,
        GuardiansService,
        TeachersService
    ],
    controllers: [
        UsersController,
        StudentsController,
        GuardiansController,
        TeachersController
    ],
    exports: [MongooseModule],
})
export class UsersModule { }
