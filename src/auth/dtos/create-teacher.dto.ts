    import { ArrayUnique, IsArray, IsBoolean, IsDateString, IsMongoId, IsOptional, IsString, Matches } from "class-validator";
    import { CreateUserDto } from "./create-user.dto";
    import { Types } from "mongoose";

    export class CreateTeacherDto extends CreateUserDto {

        @IsBoolean()
        is_active: boolean;

        @Matches(/TEA-\d{9}/)
        staff_id: string;

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

        @IsMongoId()
        @IsOptional()
        home_room?: string;
    }