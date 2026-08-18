import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: {
            permission: {
              findMany: jest
                .fn()
                .mockResolvedValue([{ id: '1', name: 'read:test' }]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findMany and return array of permissions', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', name: 'read:test' }]);
    expect(prisma.permission.findMany).toHaveBeenCalled();
  });
});
