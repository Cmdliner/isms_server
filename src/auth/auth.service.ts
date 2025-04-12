import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Guardian, GuardianDocument } from 'src/users/schemas/discriminators/guardian.schema';
import { Student, StudentDocument } from 'src/users/schemas/discriminators/student.schema';
import { Teacher, TeacherDocument } from 'src/users/schemas/discriminators/teacher.schema';
import { User } from 'src/users/schemas/user.schema';
import { UserRole } from 'src/enums';
import { CreateStudentDto } from './dtos/create-student';
import { CreateGuardianDto } from './dtos/create-guardian.dto';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { LoginStudentDto, LoginTeacherDto, LoginGuardianDto, LoginUserDto } from './dtos/login-user.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Guardian.name) private guardianModel: Model<Guardian>,
        @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
        private jwtService: JwtService
    ) { }

    async createUser(createUserDto: CreateStudentDto | CreateTeacherDto | CreateGuardianDto) {

        const { password } = createUserDto;
        const hashedPassword = await hash(password, 10);
        createUserDto.password = hashedPassword;

        switch (createUserDto.role) {
            case UserRole.STUDENT:
                const result = await this.createStudent(createUserDto as CreateStudentDto);
                return result;
            case UserRole.GUARDIAN:
                return this.createGuardian(createUserDto as CreateGuardianDto);
            case UserRole.TEACHER:
                return this.createTeacher(createUserDto as CreateTeacherDto);
            default:
                throw new BadRequestException('Unknown role. Could not create user');
        }
    }

    private async createStudent(createStudentData: CreateStudentDto): Promise<StudentDocument> {
        const result = await this.studentModel.create(createStudentData);
        return result;
    }

    private async createGuardian(createGuardianData: CreateGuardianDto): Promise<GuardianDocument> {
        return this.guardianModel.create(createGuardianData);
    }

    private async createTeacher(createTeacherData: CreateTeacherDto): Promise<TeacherDocument> {
        return this.teacherModel.create(createTeacherData);
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

    private async loginStudent(loginStudentData: LoginStudentDto) {
        const { admission_no, password } = loginStudentData;

        const student = await this.studentModel.findOne({ admission_no });
        if (!student) throw new ForbiddenException('Invalid admission number or password');

        const passwordsMatch = await compare(password, student.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid admission number or password');

        const payload = { sub: student.id, role: student.role };
        return { access_token: this.jwtService.signAsync(payload, { expiresIn: '7d' }) }
    }

    private async loginTeacher(loginTeacherData: LoginTeacherDto) {
        const { staff_id, password } = loginTeacherData;

        const teacher = await this.teacherModel.findOne({ staff_id });
        if (!teacher) throw new ForbiddenException('Invalid staff id or password');

        const passwordsMatch = await compare(password, teacher.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid staff id or password');

        const payload = { sub: teacher._id, role: teacher.role };
        return { access_token: this.jwtService.signAsync(payload, { expiresIn: '1d' }) }

    }

    private async loginGuardian(loginGuardianData: LoginGuardianDto) {
        const { email, password } = loginGuardianData;

        const guardian = await this.guardianModel.findOne({ email });
        if (!guardian) throw new ForbiddenException('Invalid email or password');

        const passwordsMatch = await compare(password, guardian.password);
        if (!passwordsMatch) throw new ForbiddenException('Invalid email or password');

        const payload = { sub: guardian._id, role: guardian.role };
        return { access_token: this.jwtService.signAsync(payload, { expiresIn: '2h' }) }
    }


}
