import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Student, StudentSchema } from './schemas/discriminators/student.schema';
import { Teacher, TeacherSchema } from './schemas/discriminators/teacher.schema';
import { Guardian, GuardianSchema } from './schemas/discriminators/guardian.schema';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { GuardiansController } from './controllers/guardians.controller';
import { TeachersController } from './controllers/teachers.controller';
import { GuardiansService } from './services/guardians.service';
import { TeachersService } from './services/teachers.service';

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
