import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: '1' }),
            create: jest.fn().mockResolvedValue({ id: '1' }),
            update: jest.fn().mockResolvedValue({ id: '1' }),
            remove: jest.fn().mockResolvedValue({ id: '1' }),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all services', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a service', async () => {
    await controller.create(
      { id: 'user1' },
      { name: 'test', price: 10, duration: 60, categoryId: '1' },
    );
    expect(service.create).toHaveBeenCalled();
  });

  it('should call searchServices on search endpoint', async () => {
    (service as any).searchServices = jest.fn().mockResolvedValue({ items: [], totalItems: 0 });
    const res = await controller.search({ query: 'plumbing' });
    expect(service.searchServices).toHaveBeenCalledWith({ query: 'plumbing' });
    expect(res).toEqual({ items: [], totalItems: 0 });
  });
});
