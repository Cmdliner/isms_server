import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from '../decorators/cookies.decorator';
import { THIRTY_DAYS_IN_MS } from '../lib/constants';
import { roleToCreateDtoMap, roleToLoginDtoMap } from '../lib/utils';
import { RoleValidationPipe } from '../pipes/role-validation.pipe';
import { AuthService } from './auth.service';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateStudentDto } from './dtos/create-student';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { LoginGuardianDto, LoginStudentDto, LoginTeacherDto } from './dtos/login-user.dto';


@Controller({ version: '1', path: 'auth' })
export class AuthController {   

    constructor(
        private readonly authService: AuthService,
    ) { }

    // @UseInterceptors(FileInterceptor('profile_image'))
    @Post('register')
    async register(
        @Body(new RoleValidationPipe(roleToCreateDtoMap)) createUserDto: CreateStudentDto | CreateGuardianDto | CreateTeacherDto,
        /*  @UploadedFile() profile_image: Express.Multer.File */) {
        const result = await this.authService.createUser(createUserDto);
        return { success: true, user: result };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(new RoleValidationPipe(roleToLoginDtoMap)) loginUserDto: LoginStudentDto | LoginTeacherDto | LoginGuardianDto, @Res({ passthrough: true }) res: Response,) {
        const { access_token, refresh_token } = await this.authService.login(loginUserDto);
        res.cookie('refresh', refresh_token, { maxAge: THIRTY_DAYS_IN_MS, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return { success: true, access_token };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Cookies('refresh') refresh_cookie: string) {
        const { access_token } = await this.authService.refresh(refresh_cookie);
        // Return  403 with reason & delete cookie if it has expired or being tempered with

        // Create a new access_token && return it
        return { success: true, access_token };

    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Res() res: Response) {
        // ! todo => Blacklist that access_token by storing it in some kind of black-listed cache
        res.clearCookie('refresh');
    }

}
