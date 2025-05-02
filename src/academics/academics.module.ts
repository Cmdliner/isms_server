import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AttendanceController } from './controllers/attendance.controller';
import { ClassroomController } from './controllers/classroom.controller';
import { GradeController } from './controllers/grade.controller';
import { ResultController } from './controllers/result.controller';
import { SubjectController } from './controllers/subject.controller';
import { Attendance, AttendanceSchema } from './schemas/attendance.schema';
import { Classroom, ClassroomSchema } from './schemas/classroom.schema';
import { Grade, GradeSchema } from './schemas/grade.schema';
import { Result, ResultSchema } from './schemas/result.schema';
import { Subject, SubjectSchema } from './schemas/subject.schema';
import { AttendanceService } from './services/attendance.service';
import { ClassroomService } from './services/classroom.service';
import { GradeService } from './services/grade.service';
import { ResultService } from './services/result.service';
import { SubjectsService } from './services/subject.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Classroom.name, schema: ClassroomSchema },
            { name: Grade.name, schema: GradeSchema },
            { name: Subject.name, schema: SubjectSchema },
            { name: Attendance.name, schema: AttendanceSchema },
            { name: Result.name, schema: ResultSchema }
        ]),
        UsersModule,
        JwtModule
    ],
    providers: [
        SubjectsService,
        AttendanceService,
        ClassroomService,
        GradeService,
        ResultService
    ],
    controllers: [
        SubjectController,
        AttendanceController,
        ClassroomController,
        GradeController,
        ResultController
    ],
    exports: []
})
export class AcademicsModule { }
