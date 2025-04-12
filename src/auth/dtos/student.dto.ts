import { ArrayNotEmpty, IsAlpha, IsArray, IsDateString, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class StudentCreate {

    @IsStrongPassword()
    password: string;

    @IsAlpha()
    first_name: string;

    @IsAlpha()
    last_name: string;

    @Matches(/\*/)
    admission_no: string;

    @IsArray()
    @ArrayNotEmpty()
    guardians: string[];

    @IsDateString()
    date_of_birth: Date;

    @IsEnum(['M', 'F'])
    gender: string;


    // medical_info?: string;

    @IsString()
    email?: string;
}

export class StudentLogin {
    @Matches(/\*/)
    admission_no: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}