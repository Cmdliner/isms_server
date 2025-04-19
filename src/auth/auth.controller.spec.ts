import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Create a mock of the AuthService
const mockAuthService = {
  // Add mock methods that your controller uses
  login: jest.fn().mockResolvedValue({ success: true, tokens: { access_token: 'test-token' } }),
  register: jest.fn().mockResolvedValue({ success: true, user: { _id: 'dkkgmrkglkrelt' } })
  // Add other methods as needed
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
