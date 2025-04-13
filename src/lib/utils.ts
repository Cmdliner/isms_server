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

