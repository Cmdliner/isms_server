import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { ResultService } from "../services/result.service";

@Controller({ version: '1', path: 'results' })
@UseGuards(AuthGuard)
export class ResultController {
    constructor(private readonly resultService: ResultService) { }

    @Get('student/:studentId')
    // @Roles('student', 'parent', 'teacher', 'admin')
    async getStudentResult(
        @Param('studentId') studentId: string,
        @Query('session') session: string,
        @Query('term') term?: string
    ) {
        const result = await this.resultService.getStudentResult(
            new Types.ObjectId(studentId),
            session
        );
        return { success: true, result };
    }

    @Get('class/:classroomId')
    // @Roles('teacher', 'admin')
    async getClassResults(
        @Param('classroomId') classroomId: string,
        @Query('session') session: string,
        @Query('term') term?: string
    ) {
        const results = await this.resultService.getClassResults(
            new Types.ObjectId(classroomId),
            session,
            term
        );
        return { success: true, results };
    }

    @Post('class/:classroomId/promotion')
    // @Roles('admin')
    async calculatePromotionStatus(
        @Param('classroomId') classroomId: string,
        @Query('session') session: string
    ) {
        const results = await this.resultService.calculatePromotionStatus(
            new Types.ObjectId(classroomId),
            session
        );
        return { success: true, results };
    }

    @Put(':resultId/comments')
    // @Roles('teacher', 'admin')
    async updateTermComments(
        @Param('resultId') resultId: string,
        @Query('term') term: string,
        @Body() comments: { teacher_comment?: string, principal_comment?: string }
    ) {
        const result = await this.resultService.updateTermComment(
            resultId,
            term,
            comments
        );
        return { success: true, result };
    }
}