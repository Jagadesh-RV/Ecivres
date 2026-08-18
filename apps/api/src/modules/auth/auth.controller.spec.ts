import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register with correct dto', async () => {
    const registerDto = {
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
    };
    const result = {
      access_token: 'token',
      refresh_token: 'refresh',
      user: { id: '1', email: 'test@test.com' },
    };
    jest.spyOn(authService, 'register').mockResolvedValue(result);

    expect(await controller.register(registerDto)).toBe(result);
    expect(authService.register).toHaveBeenCalledWith(registerDto);
  });

  it('should call login with correct dto', async () => {
    const loginDto = { email: 'test@test.com', password: 'password' };
    const result = {
      access_token: 'token',
      refresh_token: 'refresh',
      user: { id: '1', email: 'test@test.com' },
    };
    jest.spyOn(authService, 'login').mockResolvedValue(result);

    expect(await controller.login(loginDto)).toBe(result);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });

  it('should call refresh with correct token', async () => {
    const result = { access_token: 'token2', refresh_token: 'refresh2' };
    jest.spyOn(authService, 'refresh').mockResolvedValue(result);

    expect(await controller.refresh('refresh')).toBe(result);
    expect(authService.refresh).toHaveBeenCalledWith('refresh');
  });

  it('should call logout with correct token', async () => {
    const result = { success: true };
    jest.spyOn(authService, 'logout').mockResolvedValue(result);

    expect(await controller.logout('refresh')).toBe(result);
    expect(authService.logout).toHaveBeenCalledWith('refresh');
  });
});
