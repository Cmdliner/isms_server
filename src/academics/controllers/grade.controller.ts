import { Body, Controller, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { GradeUpdateDataDto, GradeUploadDataDto, ResultsQuery } from "../dtos/grade.dto";
import { GradeService } from "../services/grade.service";

@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'grades' })
export class GradeController {
    constructor(
        private gradeService: GradeService,
    ) { }

    @Post()
    async uploadGrade(@Body() gradeUploadDto: GradeUploadDataDto) {
        const grade =  await this.gradeService.uploadGrade(gradeUploadDto);
        return { success: true, grade }
    }

    @Put()
    async updateGrade(@Body()  gradeData: GradeUpdateDataDto) {
        const grade =  this.gradeService.uploadGrade(gradeData);
        return { success: true, grade }
    }

    @Get()
    async results(@Query() resultQuery: ResultsQuery) {
        return this.gradeService.processResults(resultQuery);
    }

}