    import { ArrayUnique, IsArray, IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { CreateUserDto } from "./create-user.dto";

    export class CreateTeacherDto extends CreateUserDto {

        @IsBoolean()
        is_active: boolean;

        @IsArray()
        @ArrayUnique()
        @IsOptional()
        subjects: Types.ObjectId[];

        @IsArray()
        @ArrayUnique()
        qualifications: string[];

        @IsDateString()
        employed_at: Date;

        @IsString()
        @IsOptional()
        bio?: string;

        @IsBoolean()
        is_hod: boolean;

    }