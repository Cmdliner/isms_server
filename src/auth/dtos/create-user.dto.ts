import { IsAlpha, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { UserRole } from "../../lib/enums";

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

    @IsEnum(['M', 'F'])
    gender: string;

}