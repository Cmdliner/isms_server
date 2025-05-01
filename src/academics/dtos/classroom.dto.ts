import { IsMongoId, IsString, Matches } from "class-validator";
import { Types } from "mongoose";
import { IsValidAcademicYear } from "../../decorators/is-valid-academic-year.decorator";

export class CreateClassroomDto {

    @IsString()
    name: string;

    @IsString()
    @IsValidAcademicYear()
    academic_session: string;
}

export class TransferStudentDto {
    
    @IsMongoId()
    student_id: Types.ObjectId;

    @IsMongoId()
    old_classroom_id: Types.ObjectId;

    @IsMongoId()
    new_classroom_id: Types.ObjectId;
}
