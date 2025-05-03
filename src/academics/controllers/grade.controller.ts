import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { UserRole } from "../../lib/enums";
import { parseCSV } from "../../lib/utils";
import { ObjectIdPipe } from "../../pipes/mongo-objectid.pipe";
import { ClassStatsQuery, GradeUpdateDataDto, GradeUploadDataDto, ResultsQuery } from "../dtos/grade.dto";
import { GradeService } from "../services/grade.service";

@UseGuards(AuthGuard, RolesGuard)
@Controller({ version: '1', path: 'grades' })
export class GradeController {
    constructor(
        private gradeService: GradeService,
    ) { }

    @Post()
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async uploadGrade(@Body() gradeUploadDto: GradeUploadDataDto) {
        const grade = await this.gradeService.uploadGrade(gradeUploadDto);
        return { success: true, grade }
    }

    @Post('bulk-upload')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUploadGrades(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('File is required');

        try {
            const gradesData = await parseCSV<GradeUploadDataDto>(file.buffer.toString());
            const results = await this.gradeService.bulkUploadGrades(gradesData);

            return { ...results }
        } catch (error) {
            throw new BadRequestException('Failed to process file');
        }
    }

    @Put()
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async updateGrade(@Body() gradeData: GradeUpdateDataDto) {
        const grade = this.gradeService.uploadGrade(gradeData);
        return { success: true, grade }
    }

    @Get(':id')
    @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.STUDENT, UserRole.GUARDIAN)
    async getGrade(@Param('id') id: string) {
        const grade = await this.gradeService.getGrade(id);
        return { success: true, grade };
    }

    @Get()
    @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.STUDENT, UserRole.GUARDIAN)
    async getGrades(@Query() query: Partial<ResultsQuery>) {
        const grades = await this.gradeService.getGrades(query);
        return { success: true, grades };
    }

    @Get('statistics/class')
    @Roles(UserRole.TEACHER, UserRole.ADMIN)
    async getClassStatistics(@Query() query: ClassStatsQuery) {
        const stats = await this.gradeService.getGradesStatistics(query);
        return { success: true, stats }
    }

    @Delete('id')
    @Roles(UserRole.ADMIN)
    async deleteGrade(@Param('id', ObjectIdPipe) id: Types.ObjectId) {
        await this.gradeService.deleteGrade(id);
        return { success: true, message: 'Grade deleted' }
    }


}