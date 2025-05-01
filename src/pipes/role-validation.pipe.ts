import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { error } from "console";

@Injectable()
export class RoleValidationPipe implements PipeTransform {

    constructor(private readonly roleToDtoMap: Record<string, any>) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (!value?.role) {
            throw new UnprocessableEntityException('Role is required');
        }

        const dtoClass = this.roleToDtoMap[value.role];
        if(!dtoClass) throw new BadRequestException('Unknown role. Could not validate');

        const dtoInstance = plainToInstance(dtoClass, value)

        const errors = await validate(dtoInstance);

        if (errors.length) throw new BadRequestException(errors.map(error => error.constraints));

        return dtoInstance;
    }
}