import { ValidationError } from "@nestjs/common";
import { Transform } from "class-transformer";
import { Types } from "mongoose";
import { CreateGuardianDto } from "../auth/dtos/create-guardian.dto";
import { CreateStudentDto } from "../auth/dtos/create-student";
import { CreateTeacherDto } from "../auth/dtos/create-teacher.dto";
import { LoginGuardianDto, LoginStudentDto, LoginTeacherDto } from "../auth/dtos/login-user.dto";
import { UserRole } from "./enums";


export const roleToLoginDtoMap = {
    [UserRole.STUDENT]: LoginStudentDto,
    [UserRole.GUARDIAN]: LoginGuardianDto,
    [UserRole.TEACHER]: LoginTeacherDto
}

export const roleToCreateDtoMap = {
    [UserRole.STUDENT]: CreateStudentDto,
    [UserRole.GUARDIAN]: CreateGuardianDto,
    [UserRole.TEACHER]: CreateTeacherDto
}

export const roleToUserModelMap = {
    [UserRole.STUDENT]: "studentModel",
    [UserRole.GUARDIAN]: "guardianModel",
    [UserRole.TEACHER]: "teacherModel"
}

export const extractValidationErrorMessages = (error: ValidationError): string[] => {
    const messages: string[] = [];

    if (error.constraints) messages.push(...Object.values(error.constraints));

    if (error.children?.length) {
        for (const child of error.children) {
            const childMessages = extractValidationErrorMessages(child);
            messages.push(...childMessages.map(m => `${error.property}.${m}`));
        }
    }

    return messages;
}

export const TransformToObjectId = () => {
    return Transform(({ value }) => {
        if (value && typeof value === 'string' && Types.ObjectId.isValid(value)) {
            return new Types.ObjectId(value);
        }
        return value;
    })
}

export const compareObjectId = (a: Types.ObjectId, b: Types.ObjectId) => a.toString() === b.toString();


export async function parseCSV<T>(csv_file: string): Promise<T[]> {
    return [];
}