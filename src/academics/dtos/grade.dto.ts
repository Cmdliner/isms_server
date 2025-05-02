import { IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { IsValidAcademicYear } from "../../decorators/is-valid-academic-year.decorator";
import { TransformToObjectId } from "../../lib/utils";

export class GradeUploadDataDto {

    @IsMongoId()
    @TransformToObjectId()
    subject: Types.ObjectId;

    @IsMongoId()
    @TransformToObjectId()
    student: Types.ObjectId;

    @IsMongoId()
    @TransformToObjectId()
    classroom: Types.ObjectId;

    @IsString()
    school_term: string;

    @IsValidAcademicYear()
    academic_session: string;

    @IsMongoId()
    @TransformToObjectId()
    uploaded_by: Types.ObjectId;

    @IsNumber()
    examination_score: number;

    @IsNumber()
    continuous_assessment: number;
}

export class GradeUpdateDataDto extends GradeUploadDataDto {}

export class ResultsQuery {
    @IsMongoId()
    student: Types.ObjectId

    @IsValidAcademicYear()
    session: string;

    @IsMongoId()
    subject: Types.ObjectId;

    @IsString()
    @IsOptional()
    term: string;
}