import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AttendanceController } from './controllers/attendance.controller';
import { ClassroomController } from './controllers/classroom.controller';
import { SubjectController } from './controllers/subjects.controller';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Grade, GradeSchema } from './schemas/grade.schema';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { AttendanceService } from './services/attendance.service';
import { ClassroomService } from './services/classroom.service';
import { SubjectsService } from './services/subjects.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Classroom.name, schema: ClassroomSchema },
            { name: Grade.name, schema: GradeSchema },
            { name: Subject.name, schema: SubjectSchema },
            { name: Attendance.name, schema: AttendanceSchema }
        ]),
        UsersModule,
        JwtModule
    ],
    providers: [
        SubjectsService,
        AttendanceService,
        ClassroomService
    ],
    controllers: [
        SubjectController,
        AttendanceController,
        ClassroomController
    ],
    exports: []
})
export class AcademicsModule { }
