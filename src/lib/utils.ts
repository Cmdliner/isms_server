import { ValidationError } from "@nestjs/common";
import { CreateGuardianDto } from "../auth/dtos/create-guardian.dto";
import { CreateStudentDto } from "../auth/dtos/create-student";
import { CreateTeacherDto } from "../auth/dtos/create-teacher.dto";
import { LoginStudentDto, LoginGuardianDto, LoginTeacherDto } from "../auth/dtos/login-user.dto";
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

    if(error.constraints) messages.push(...Object.values(error.constraints));

    if(error.children?.length) {
        for (const child of error.children) {
            const childMessages = extractValidationErrorMessages(child);
            messages.push(...childMessages.map(m => `${error.property}.${m}`));
        }
    }

    return messages;
}