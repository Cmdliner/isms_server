import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRole } from '../lib/enums';
import { generateAdmissionNo, generateStaffID } from '../lib/utils';
import { Guardian } from '../users/schemas/discriminators/guardian.schema';
import { Student } from '../users/schemas/discriminators/student.schema';
import { Teacher } from '../users/schemas/discriminators/teacher.schema';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateStudentDto } from './dtos/create-student';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { LoginGuardianDto, LoginStudentDto, LoginTeacherDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Guardian.name) private guardianModel: Model<Guardian>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly cloudinaryService: CloudinaryService
    ) { }


    async createUser(createUserDto: CreateStudentDto | CreateTeacherDto | CreateGuardianDto, profile_img?: Express.Multer.File) {

        const { password } = createUserDto;
        const hashedPassword = await hash(password, 10);
        createUserDto.password = hashedPassword;

        switch (createUserDto.role) {
            case UserRole.STUDENT:
                return this.createStudent(createUserDto as CreateStudentDto, profile_img);
            case UserRole.GUARDIAN:
                return this.createGuardian(createUserDto as CreateGuardianDto, profile_img);
            case UserRole.TEACHER:
                return this.createTeacher(createUserDto as CreateTeacherDto, profile_img);
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


    private async createStudent(createStudentData: CreateStudentDto, profile_img?: Express.Multer.File) {
        try {
            const admission_no_sequence: number = await this.cacheManager.get('ISMS_ADMISSION_NO_CACHE') ?? 1;
            const admission_no = generateAdmissionNo(`${admission_no_sequence}`);

            const profile_upload_result = profile_img && await this.uploadProfileImage(profile_img) as any;
            const profile_image = { public_id: profile_upload_result?.public_id, secure_url: profile_upload_result?.secure_url }

            const student = await this.studentModel.create({ admission_no, profile_image, ...createStudentData });
            await this.cacheManager.set('ISMS_ADMISSION_NO_CACHE', admission_no_sequence + 1);
            return student;
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    private async createGuardian(createGuardianData: CreateGuardianDto, profile_img?: Express.Multer.File) {
        try {
            const profile_upload_result = profile_img && await this.uploadProfileImage(profile_img) as any;
            const profile_image = { public_id: profile_upload_result?.public_id, secure_url: profile_upload_result?.secure_url }

            const guardian = await this.guardianModel.create({ profile_image, ...createGuardianData });
            return guardian;
        } catch (error) {
            await this.handleUniqueError(error);
        }
    }

    private async createTeacher(createTeacherData: CreateTeacherDto, profile_img?: Express.Multer.File) {
        try {
            const staff_id_sequence = await this.cacheManager.get<number>('ISMS_STAFF_ID_CACHE') ?? 1;
            const staff_id = generateStaffID(`${staff_id_sequence}`);

            const profile_upload_result = profile_img && await this.uploadProfileImage(profile_img) as any;
            const profile_image = { public_id: profile_upload_result?.public_id, secure_url: profile_upload_result?.secure_url }

            const teacher = await this.teacherModel.create({ staff_id, profile_image, ...createTeacherData });
            await this.cacheManager.set('ISMS_STAFF_ID_CACHE', staff_id_sequence + 1);

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

    private async generateAuthToken(payload: any, expiresIn: string, token_type: TokenType = "access"): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow<string>(token_type === "refresh" ? 'REFRESH_SECRET' : 'ACCESS_SECRET'),
            expiresIn,
        });
    }

    private async uploadProfileImage(file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file, {
            folder: 'images',
            transformation: {
                width: 1_000,
                height: 1_000,
                format: 'webp',
                fetch_format: 'webp',
                crop: 'limit'
            }
        })
    }
}
