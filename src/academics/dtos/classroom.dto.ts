import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsValidAcademicYear } from "../../decorators/is-valid-academic-year.decorator";
import { TransformToObjectId } from "../../lib/utils";

export class CreateClassroomDto {

    @IsString()
    name: string;

    @IsString()
    @IsValidAcademicYear()
    academic_session: string;
}

export class TransferStudentDto {

    @IsMongoId()
    @TransformToObjectId()
    student_id: Types.ObjectId;

    @IsMongoId()
    @TransformToObjectId()
    old_classroom_id: Types.ObjectId;

    @IsMongoId()
    @TransformToObjectId()
    new_classroom_id: Types.ObjectId;
}
