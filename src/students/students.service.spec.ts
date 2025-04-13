import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { getModelToken } from '@nestjs/mongoose';
import { Student } from '../users/schemas/discriminators/student.schema';

// Create a mock for the Student model
const mockStudentModel = {
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
  // Add other methods your service uses
};

describe('StudentsService', () => {
  let service: StudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: getModelToken(Student.name),
          useValue: mockStudentModel
        }
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
