import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

// Create a mock of the StudentsService
const mockStudentsService = {
  // Add mock methods that your controller uses
  // For example:
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({}),
  // Add other methods as needed
};

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService
        }
      ]
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
