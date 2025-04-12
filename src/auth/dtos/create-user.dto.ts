import { ArrayNotEmpty, IsAlpha, IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";
import { UserRole } from "src/utils";

export class CreateUserDto {

    // @IsEnum(Object.values(UserRole))
    role: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsAlpha()
    first_name: string;

    @IsAlpha()
    last_name: string;

    @IsDateString()
    last_login: Date;

    @IsEnum(['M', 'F'])
    gender: string;

}