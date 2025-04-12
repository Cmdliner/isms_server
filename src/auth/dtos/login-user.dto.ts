import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { UserRole } from "src/utils";

export class LoginUserDto {

    // @IsEnum(Object.values(UserRole))
    role: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginStudentDto extends LoginUserDto {
    @Matches(/STU-\d{9}/)
    admission_no: string;
}

export class LoginTeacherDto extends LoginUserDto {
    @Matches(/TEA-\d{9}/)
    staff_id: string;
}

export class LoginGuardianDto extends LoginUserDto {
    @IsEmail()
    email: string;
}
