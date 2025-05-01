import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidAcademicYear(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidAcademicYear',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    // Check format first
                    if (typeof value !== 'string' || !/^\d{4}\/\d{4}$/.test(value)) {
                        return false;
                    }

                    // Split the years
                    const [startYear, endYear] = value.split('/').map(Number);

                    // Check if end year is exactly one greater than start year
                    return endYear === startYear + 1;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Academic session must be in format YYYY/YYYY where the second year is exactly one more than the first year';
                },
            },
        });
    };
}
