import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ObjectIdPipe } from '../../pipes/mongo-objectid.pipe';
import { AttendanceQuery, CreateAttendanceDto } from '../dtos/attendance.dto';
import { AttendanceService } from '../services/attendance.service';

@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'attendance' })
export class AttendanceController {

    constructor(
        private readonly attendanceService: AttendanceService,
    ) { }

    @Post(':subjectID/bulk-upload')
    async bulkUpload(
        @Param('subjectID', ObjectIdPipe) subject_id: Types.ObjectId,
        @Body() attendance_list: CreateAttendanceDto[]) {
        return this.attendanceService.bulkUpload(subject_id, attendance_list);
    }

    @Get()
    async getAttendanceForSubject(@Query() attendance_query: AttendanceQuery) {
        return this.attendanceService.find(attendance_query);
    }
}
