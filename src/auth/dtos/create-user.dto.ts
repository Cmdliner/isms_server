import { ArrayNotEmpty, IsAlpha, IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";
import { UserRole } from "src/lib/enums";

export class CreateUserDto {

    @IsEnum(UserRole)
    role: UserRole;

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