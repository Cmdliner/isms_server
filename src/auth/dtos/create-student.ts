import { ArrayUnique, IsArray, IsDateString, IsEnum, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { StudentEnrollmentStatus } from "../../lib/enums";
import { CreateUserDto } from "./create-user.dto";

export class CreateStudentDto extends CreateUserDto {

    @IsDateString()
    date_of_birth: Date;

    @IsOptional()
    medical_info?: {
        blood_group: string;
        allergies: string[];
    }

    @IsEnum(StudentEnrollmentStatus, { message: `enrollment_status must be one of: ${Object.values(StudentEnrollmentStatus).join(', ')}` })
    @IsOptional()
    enrollment_status: StudentEnrollmentStatus;

    @IsArray()
    @ArrayUnique()
    // ! todo => Ensure each item is a valid MongoId
    @IsOptional()
    guardians?: Types.ObjectId[];

}