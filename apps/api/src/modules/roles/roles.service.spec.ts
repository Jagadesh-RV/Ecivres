import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              findMany: jest
                .fn()
                .mockResolvedValue([{ id: '1', name: 'ADMIN' }]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany and return array of roles', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', name: 'ADMIN' }]);
    expect(prisma.role.findMany).toHaveBeenCalled();
  });
});
