    import { ArrayUnique, IsArray, IsBooleanString, IsDateString, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { CreateUserDto } from "./create-user.dto";

    export class CreateTeacherDto extends CreateUserDto {

        @IsBooleanString()
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

        @IsBooleanString()
        is_hod: boolean;

    }