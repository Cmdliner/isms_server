import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Student, StudentSchema } from './schemas/discriminators/student.schema';
import { Teacher, TeacherSchema } from './schemas/discriminators/teacher.schema';
import { Guardian, GuardianSchema } from './schemas/discriminators/guardian.schema';

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
        ])
    ],
    providers: [UsersService],
    exports: [MongooseModule]
})
export class UsersModule { }
