import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!isValidObjectId(value)) throw new BadRequestException('Invalid object id');
        return new Types.ObjectId(value as string);
    }
}