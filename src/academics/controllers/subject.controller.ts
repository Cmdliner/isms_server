import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ObjectIdPipe } from "../../pipes/mongo-objectid.pipe";
import { CreateSubjectDto } from "../dtos/subject.dto";
import { SubjectsService } from "../services/subject.service";

@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'subjects' })
export class SubjectController {
    constructor(private subjectsService: SubjectsService) { }

    @Post()
    async create(@Body() createSubjectDto: CreateSubjectDto) {
        const subject = await this.subjectsService.create(createSubjectDto);
        return { success: true, subject };
    }

    @Get(':id')
    async info(@Param('id', ObjectIdPipe) subject_id: Types.ObjectId) {
        return this.subjectsService.getDetails(subject_id);
    }

    @Post('allocate/:id')
    async allocateTeacher(
        @Param('id', ObjectIdPipe) subject_id: Types.ObjectId,
        @Body('teacher_id', ObjectIdPipe) teacher_id: Types.ObjectId) {
        return this.subjectsService.allocateTeacher(subject_id, teacher_id);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    async delete(@Param('id', ObjectIdPipe) subject_id: Types.ObjectId) {
        return this.subjectsService.remove(subject_id);
    }
}