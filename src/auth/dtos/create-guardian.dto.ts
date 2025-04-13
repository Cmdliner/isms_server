import { ArrayUnique, IsArray, IsEnum, IsMongoId, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { MaritalStatus } from "src/lib/enums";
import { Types } from "mongoose";

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