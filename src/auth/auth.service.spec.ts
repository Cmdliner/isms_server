import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Guardian } from '../users/schemas/discriminators/guardian.schema';
import { Student } from '../users/schemas/discriminators/student.schema';
import { Teacher } from '../users/schemas/discriminators/teacher.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Create mocks for all required models and services
const mockUserModel = {
  findOne: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(null),
};

const mockGuardianModel = {};
const mockStudentModel = {};
const mockTeacherModel = {};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('test-token'),
  signAsync: jest.fn().mockResolvedValue('test-token'),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-secret';
    return null;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Guardian.name), useValue: mockGuardianModel },
        { provide: getModelToken(Student.name), useValue: mockStudentModel },
        { provide: getModelToken(Teacher.name), useValue: mockTeacherModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
