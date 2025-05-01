import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";
import { MaritalStatus } from "../../lib/enums";
import { CreateUserDto } from "./create-user.dto";

export class CreateGuardianDto extends CreateUserDto {

    @IsArray()
    @ArrayUnique()
    // ! todo => Items in the array should be mongo id
    @IsOptional()
    wards: Types.ObjectId[];

    @IsString()
    @IsNotEmpty()
    occupation: string;

    @IsEnum(MaritalStatus)
    marital_status: MaritalStatus;

    @IsString()
    home_address: string;
}