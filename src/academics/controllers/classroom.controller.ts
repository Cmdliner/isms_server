import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { UserRole } from "../../lib/enums";
import { ObjectIdPipe } from "../../pipes/mongo-objectid.pipe";
import { CreateClassroomDto, TransferStudentDto } from "../dtos/classroom.dto";
import { ClassroomService } from "../services/classroom.service";

@UseGuards(AuthGuard, RolesGuard)
@Controller({ version: '1', path: 'classroom' })
export class ClassroomController {

    constructor(private classroomService: ClassroomService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() classroomData: CreateClassroomDto) {
        return this.classroomService.create(classroomData);
    }

    // Admin can bulk create classroom using a preset template
    async bulkCreate() { }

    @HttpCode(HttpStatus.OK)
    @Post('teacher/:classroomID/:teacherID')
    @Roles(UserRole.ADMIN)
    async assignTeacher(@Param('classroomID', ObjectIdPipe) classroom_id: Types.ObjectId, @Param('teacherID', ObjectIdPipe) teacher_id: Types.ObjectId) {
        return this.classroomService.assignTeacher(teacher_id, classroom_id);
    }

    @HttpCode(HttpStatus.OK)
    @Post('student/:classroomID/:studentID')
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async assignStudent(@Param('classroomID', ObjectIdPipe) classroom_id: Types.ObjectId, @Param('studentID', ObjectIdPipe) student_id: Types.ObjectId) {
        return this.classroomService.assignStudent(student_id, classroom_id)
    }

    @HttpCode(HttpStatus.OK)
    @Post('student/transfer')
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async transferStudent(@Body() transfer_data: TransferStudentDto) {
        return this.classroomService.transferStudent(transfer_data);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':id')
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async getAllStudents(@Param('id') classroom_id: Types.ObjectId) {
        return this.classroomService.findAll(classroom_id);
    }


    async delete() { }
}