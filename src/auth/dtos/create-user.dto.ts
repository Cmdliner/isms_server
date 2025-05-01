import { IsAlpha, IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { Gender, UserRole } from "../../lib/enums";

export class CreateUserDto {

    @IsEnum(UserRole)
    role: UserRole;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsAlpha()
    first_name: string;

    @IsAlpha()
    last_name: string;

    @IsEnum(Gender)
    gender: Gender;

}