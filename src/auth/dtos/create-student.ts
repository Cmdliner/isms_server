import { IsDateString, IsEnum, Matches } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { StudentEnrollmentStatus } from "src/lib/enums";

export class CreateStudentDto extends CreateUserDto {

    @Matches(/STU-\d{9}/)
    admission_no: string;

    @IsDateString()
    date_of_birth: Date;
    
    medical_info?: {
        blood_group: string;
        allergies: string[];
    }

    @IsEnum(StudentEnrollmentStatus, {
        message: `enrollment_status must be one of: ${Object.values(StudentEnrollmentStatus).join(', ')}`
    })
    enrollment_status: StudentEnrollmentStatus;

}