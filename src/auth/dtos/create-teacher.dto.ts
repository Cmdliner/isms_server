import { ArrayUnique, IsArray, IsBoolean, IsDateString, IsString, Matches } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { Types } from "mongoose";

export class CreateTeacherDto extends CreateUserDto {

    @IsBoolean()
    is_active: boolean;

    @Matches(/TEA-\d{9}/)
    staff_id: string;

    @IsArray()
    subjects: Types.ObjectId[];

    @IsArray()
    @ArrayUnique()
    qualifications: string[];

    @IsDateString()
    employed_at: Date;

    @IsString()
    bio?: string;

    @IsBoolean()
    is_hod: boolean;
}