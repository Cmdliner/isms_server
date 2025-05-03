import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { UserRole } from "../../lib/enums";
import { ObjectIdPipe } from "../../pipes/mongo-objectid.pipe";
import { CreateSubjectDto } from "../dtos/subject.dto";
import { SubjectsService } from "../services/subject.service";

@UseGuards(AuthGuard, RolesGuard)
@Controller({ version: '1', path: 'subjects' })
export class SubjectController {

    constructor(private subjectsService: SubjectsService) { }

    @Post()
    @Roles([UserRole.ADMIN])
    async create(@Body() createSubjectDto: CreateSubjectDto) {
        const subject = await this.subjectsService.create(createSubjectDto);
        return { success: true, subject };
    }

    @Get(':id')
    @Roles([UserRole.STUDENT, UserRole.GUARDIAN, UserRole.TEACHER, UserRole.ADMIN])
    async info(@Param('id', ObjectIdPipe) subject_id: Types.ObjectId) {
        return this.subjectsService.getDetails(subject_id);
    }

    @Post('allocate/:id')
    @Roles([UserRole.ADMIN])
    async allocateTeacher(
        @Param('id', ObjectIdPipe) subject_id: Types.ObjectId,
        @Body('teacher_id', ObjectIdPipe) teacher_id: Types.ObjectId) {
        return this.subjectsService.allocateTeacher(subject_id, teacher_id);
    }

    @HttpCode(HttpStatus.OK)
    @Roles([UserRole.ADMIN])
    @Delete(':id')
    async delete(@Param('id', ObjectIdPipe) subject_id: Types.ObjectId) {
        return this.subjectsService.remove(subject_id);
    }
}