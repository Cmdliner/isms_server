import { ArrayUnique, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { IsValidAcademicYear } from "../../decorators/is-valid-academic-year.decorator";

export class CreateSubjectDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    teachers: string[];

    @IsString()
    grade_level: string;

    @IsString()
    @IsValidAcademicYear()
    academic_session: string;

    @IsBoolean()
    is_active: boolean;

}