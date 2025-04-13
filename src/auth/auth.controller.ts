import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleValidationPipe } from './pipes/role-validation.pipe';
import { roleToCreateDtoMap, roleToLoginDtoMap } from 'src/lib/utils';
import { LoginGuardianDto, LoginStudentDto, LoginTeacherDto } from './dtos/login-user.dto';
import { CreateStudentDto } from './dtos/create-student';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateTeacherDto } from './dtos/create-teacher.dto';


@Controller({ version: '1', path: 'auth' })
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body(new RoleValidationPipe(roleToCreateDtoMap)) createUserDto: CreateStudentDto | CreateGuardianDto | CreateTeacherDto) {
        const result = await this.authService.createUser(createUserDto);
        return { success: true, user: result };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(new RoleValidationPipe(roleToLoginDtoMap)) loginUserDto: LoginStudentDto | LoginTeacherDto | LoginGuardianDto) {
        const result = await this.authService.login(loginUserDto);
        return { success: true, tokens: result };
    }
}
