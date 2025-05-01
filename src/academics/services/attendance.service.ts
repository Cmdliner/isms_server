import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from '../schemas/attendance.schema';
import { Subject } from '../../academics/schemas/subject.schema';
import { CreateAttendanceDto, AttendanceQuery } from '../dtos/attendance.dto';

@Injectable()
export class AttendanceService {

    constructor(
        @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
        @InjectModel(Subject.name) private subjectModel: Model<Subject>
    ) { }

    /** @description Takes bulk attendance per subject */
    async bulkUpload(subject_id: Types.ObjectId, attendance_data: CreateAttendanceDto[]) {

        const subjectExists = await this.subjectModel.exists({ _id: subject_id });
        if (!subjectExists) throw new NotFoundException('Subject not found');

        await this.attendanceModel.insertMany(attendance_data);
        return { success: true, message: 'Attendance successfully uploaded' };
    }

    async find(attendance_query_params: AttendanceQuery) {
        // !todo => Check that the academic session is valid fmt && not in future
        const { student, subject, academic_session, status } = attendance_query_params;

        let attendanceQuery: AttendanceQuery = { student, subject, academic_session };
        if (status) attendanceQuery.status = status;

        const attendance = await this.attendanceModel.find(attendanceQuery).sort({ date: -1 });
        const count = await this.attendanceModel.find(attendanceQuery).countDocuments();


        return { success: true, attendance, count }
    }
}
