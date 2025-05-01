import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Grade, GradeSchema } from './schemas/grade.schema';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { SubjectsService } from './services/subjects.service';
import { SubjectController } from './controllers/subjects.controller';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { ClassroomService } from './services/classroom.service';
import { ClassroomController } from './controllers/classroom.controller';
import { JwtModule } from '@nestjs/jwt';

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
