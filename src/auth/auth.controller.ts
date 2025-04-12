import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleValidationPipe } from './pipes/role-validation.pipe';
import { roleToCreateDtoMap, roleToLoginDtoMap } from 'src/utils';
import { LoginGuardianDto, LoginStudentDto, LoginTeacherDto } from './dtos/login-user.dto';
import { CreateStudentDto } from './dtos/create-student';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateTeacherDto } from './dtos/create-teacher.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }


    @Post('register')
    async register(@Body(new RoleValidationPipe(roleToCreateDtoMap)) createUserDto: CreateStudentDto | CreateGuardianDto | CreateTeacherDto) {
        await this.authService.createUser(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(new RoleValidationPipe(roleToLoginDtoMap)) loginUserDto: LoginStudentDto | LoginTeacherDto | LoginGuardianDto) {
        await this.authService.login(loginUserDto);
    }
}
