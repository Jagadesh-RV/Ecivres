import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([{ id: '1', name: 'Cleaning' }]),
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

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll and return array of categories', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: '1', name: 'Cleaning' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call create and return created category', async () => {
    const dto = { name: 'Plumbing', description: 'Plumbing category' };
    (service as any).create = jest.fn().mockResolvedValue({ id: '2', ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: '2', ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findOne and return category by ID', async () => {
    (service as any).findOne = jest.fn().mockResolvedValue({ id: '1', name: 'Cleaning' });

    const result = await controller.findOne('1');
    expect(result).toEqual({ id: '1', name: 'Cleaning' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });
});
