import { IsEnum, IsMongoId, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { IsValidAcademicYear } from "../../decorators/is-valid-academic-year.decorator";
import { AttendanceStatus } from "../../lib/enums";
import { TransformToObjectId } from "../../lib/utils";

export class CreateAttendanceDto {

    @IsMongoId()
    student: Types.ObjectId;

    @IsMongoId()
    subject: Types.ObjectId;

    @IsEnum(AttendanceStatus, { message: `enrollment_status must be one of: ${Object.values(AttendanceStatus).join(', ')}` })
    status: AttendanceStatus;

    @IsValidAcademicYear()
    academic_session: string;

}

export class AttendanceQuery {

    @IsMongoId()
    @TransformToObjectId()
    subject: Types.ObjectId;

    @IsMongoId()
    @TransformToObjectId()
    student: Types.ObjectId;

    @IsValidAcademicYear()
    academic_session: string;

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status?: string;
}