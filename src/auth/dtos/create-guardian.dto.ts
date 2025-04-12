import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { MaritalStatus } from "src/utils";

export class CreateGuardianDto extends CreateUserDto {

    @IsString()
    @IsNotEmpty()
    occupation: string;

    // @IsEnum(Object.values(MaritalStatus))
    marital_status: string;

    @IsObject()
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    }
}