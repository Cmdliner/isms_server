import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRole } from '../../lib/enums';
import { ObjectIdPipe } from '../../pipes/mongo-objectid.pipe';
import { AttendanceQuery, CreateAttendanceDto } from '../dtos/attendance.dto';
import { AttendanceService } from '../services/attendance.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller({ version: '1', path: 'attendance' })
export class AttendanceController {

    constructor(
        private readonly attendanceService: AttendanceService,
    ) { }

    @Post(':subjectID/bulk-upload')
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    async bulkUpload(
        @Param('subjectID', ObjectIdPipe) subject_id: Types.ObjectId,
        @Body() attendance_list: CreateAttendanceDto[]) {
        return this.attendanceService.bulkUpload(subject_id, attendance_list);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.TEACHER)
    async getAttendanceForSubject(@Query() attendance_query: AttendanceQuery) {
        return this.attendanceService.find(attendance_query);
    }
}
