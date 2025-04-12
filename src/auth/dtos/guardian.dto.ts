import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPostalCode, IsString, IsStrongPassword } from "class-validator";
import { MaritalStatus } from "src/utils";

export class GuardianCreateDto {

    @IsEmail()
    email?: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsDateString()
    last_login: string;

    @IsString()
    occupation: string;

    @IsEnum(MaritalStatus)
    marital_status: string;

    address: GuardianAddress;
}

class GuardianAddress {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    state: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsPostalCode()
    postal_code: string;
}

export class GuardianLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}