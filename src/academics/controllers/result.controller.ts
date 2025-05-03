import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthGuard } from "../../auth/guards/auth.guard";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { UserRole } from "../../lib/enums";
import { ResultService } from "../services/result.service";

@Controller({ version: '1', path: 'results' })
@UseGuards(AuthGuard, RolesGuard)
export class ResultController {

    constructor(private readonly resultService: ResultService) { }

    @Get('student/:studentId')
    @Roles([UserRole.STUDENT, UserRole.GUARDIAN, UserRole.TEACHER, UserRole.ADMIN])
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
    @Roles([UserRole.TEACHER, UserRole.ADMIN])
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
    @Roles([UserRole.ADMIN])
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
    @Roles([UserRole.TEACHER, UserRole.ADMIN])
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