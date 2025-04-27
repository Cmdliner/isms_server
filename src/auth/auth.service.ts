import { BadRequestException, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guardian } from '../users/schemas/discriminators/guardian.schema';
import { Student } from '../users/schemas/discriminators/student.schema';
import { Teacher } from '../users/schemas/discriminators/teacher.schema';
import { User } from '../users/schemas/user.schema';
import { UserRole } from '../lib/enums';
import { CreateStudentDto } from './dtos/create-student';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { LoginStudentDto, LoginTeacherDto, LoginGuardianDto } from './dtos/login-user.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Guardian.name) private guardianModel: Model<Guardian>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    static ADMISSION_NO_SERIAL_CACHE = 100_000_000;
    static STAFF_ID_SERIAL_CACHE = 10_000;

    async createUser(createUserDto: CreateStudentDto | CreateTeacherDto | CreateGuardianDto) {

        const { password } = createUserDto;
        const hashedPassword = await hash(password, 10);
        createUserDto.password = hashedPassword;

        switch (createUserDto.role) {
            case UserRole.STUDENT:
                return this.createStudent(createUserDto as CreateStudentDto);
            case UserRole.GUARDIAN:
                return this.createGuardian(createUserDto as CreateGuardianDto);
            case UserRole.TEACHER:
                return this.createTeacher(createUserDto as CreateTeacherDto);
            default:
                throw new BadRequestException('Unknown role. Could not create user');
        }
    }

    async login(loginUserDto: LoginStudentDto | LoginTeacherDto | LoginGuardianDto) {
        switch (loginUserDto.role) {
            case UserRole.STUDENT:
                return this.loginStudent(loginUserDto as LoginStudentDto);
            case UserRole.GUARDIAN:
                return this.loginGuardian(loginUserDto as LoginGuardianDto);
            case UserRole.TEACHER:
                return this.loginTeacher(loginUserDto as LoginTeacherDto);
            default:
                throw new BadRequestException('Unknown role. Could not sign in');

        }
    }

    async refresh(refresh_token: string) {
        const { sub, role } = await this.jwtService.verifyAsync(refresh_token, { secret: this.configService.get<string>('REFRESH_SECRET') });
        const payload = { sub, role };
        if (!payload.sub) throw new UnauthorizedException('Unauthorized!');

        const access_token = await this.generateAuthToken(payload, '2h');

        return { access_token };
    }

    async logout() { }


    private async createStudent(createStudentData: CreateStudentDto) {
        try {
            // ! todo => generate a serial admission no get last admission no from a cache like, redis
            const admission_no = `STU-${AuthService.ADMISSION_NO_SERIAL_CACHE += 1}`;
            const student = await this.studentModel.create({ admission_no, ...createStudentData });
            return student;
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    private async createGuardian(createGuardianData: CreateGuardianDto) {
        try {
            const guardian = await this.guardianModel.create(createGuardianData);
            return guardian;
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    private async createTeacher(createTeacherData: CreateTeacherDto) {
        try {
            const staff_id = `TEA-${new Date().getFullYear()}${AuthService.STAFF_ID_SERIAL_CACHE += 1}`;
            const teacher = await this.teacherModel.create({ ...createTeacherData, staff_id });
            return teacher;
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    private async loginStudent(loginStudentData: LoginStudentDto) {
        const { admission_no, password } = loginStudentData;

        const student = await this.studentModel.findOne({ admission_no });
        if (!student) throw new ForbiddenException('Invalid admission number or password');

        const passwordsMatch = await compare(password, student.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid admission number or password');

        const payload = { sub: student.id, role: student.role };
        const access_token = await this.generateAuthToken(payload, '2h');
        const refresh_token = await this.generateAuthToken(payload, '30d', 'refresh');

        await Promise.all([access_token, refresh_token]);
        return { access_token, refresh_token };
    }

    private async loginTeacher(loginTeacherData: LoginTeacherDto) {
        const { staff_id, password } = loginTeacherData;

        const teacher = await this.teacherModel.findOne({ staff_id });
        if (!teacher) throw new ForbiddenException('Invalid staff id or password');

        const passwordsMatch = await compare(password, teacher.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid staff id or password');

        const payload = { sub: teacher._id, role: teacher.role };
        const access_token = await this.generateAuthToken(payload, '2h');
        const refresh_token = await this.generateAuthToken(payload, '30d', 'refresh');

        return { access_token, refresh_token };
    }

    private async loginGuardian(loginGuardianData: LoginGuardianDto) {
        const { email, password } = loginGuardianData;

        const guardian = await this.guardianModel.findOne({ email });
        if (!guardian) throw new ForbiddenException('Invalid email or password');

        const passwordsMatch = await compare(password, guardian.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid email or password');

        const payload = { sub: guardian._id, role: guardian.role };
        const access_token = await this.generateAuthToken(payload, '2h');
        const refresh_token = await this.generateAuthToken(payload, '30d', 'refresh');

        return { access_token, refresh_token };
    }

    private async handleUniqueError(error: any): Promise<void> {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            throw new BadRequestException(`The ${field} '${value}' is already taken.`);
        }
        throw new BadRequestException(error.message);
    }

    private async generateAuthToken(payload: any, expiresIn: string, token_type: "access" | "refresh" = "access"): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>(token_type === "refresh" ? 'REFRESH_SECRET' : 'ACCESS_SECRET'),
            expiresIn,
        });
    }
}
