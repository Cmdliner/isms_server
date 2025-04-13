import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { MaritalStatus } from "src/lib/enums";

export class CreateGuardianDto extends CreateUserDto {

    @IsString()
    @IsNotEmpty()
    occupation: string;

    @IsEnum(MaritalStatus)
    marital_status: MaritalStatus;

    @IsObject()
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    }
}