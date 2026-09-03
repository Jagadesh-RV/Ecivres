import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    userRoles: [{ role: { name: 'CUSTOMER' } }],
    customerProfile: { id: 'cp-1', firstName: 'John', lastName: 'Doe' },
    providerProfile: null,
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      customerProfile: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      providerProfile: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      role: {
        findUnique: jest.fn(),
      },
      userRole: {
        upsert: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prismaService)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return mapped user details when found', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOneById('user-1');

      expect(result.id).toEqual('user-1');
      expect(result.email).toEqual('test@example.com');
      expect(result.roles).toEqual(['CUSTOMER']);
      expect(result.hasCustomerProfile).toBe(true);
      expect(result.hasProviderProfile).toBe(false);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOneById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    it('should update password when current password is valid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword');
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.user.update.mockResolvedValue({ ...mockUser, password: 'newhashedpassword' });

      const result = await service.changePassword('user-1', 'oldpass', 'newpass123');

      expect(result.message).toEqual('Password changed successfully');
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException when current password is invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.changePassword('user-1', 'wrongpass', 'newpass123')).rejects.toThrow(BadRequestException);
    });
  });
  describe('getCustomerDashboardStats', () => {
    it('should calculate and return customer analytics overview', async () => {
      prismaService.customerProfile.findUnique.mockResolvedValue({ id: 'cp-1', userId: 'user-1' });
      prismaService.booking = {
        count: jest.fn().mockImplementation(({ where }) => {
          if (where.status?.in) return Promise.resolve(2);
          if (where.status === 'COMPLETED') return Promise.resolve(5);
          return Promise.resolve(7);
        }),
        findMany: jest.fn().mockResolvedValue([
          { id: 'b-1', service: { price: 100 } },
          { id: 'b-2', service: { price: 150 } },
        ]),
      };
      prismaService.notification = {
        count: jest.fn().mockResolvedValue(3),
      };

      const result = await service.getCustomerDashboardStats('user-1');

      expect(result.totalBookings).toEqual(7);
      expect(result.activeBookings).toEqual(2);
      expect(result.completedBookings).toEqual(5);
      expect(result.unreadNotifications).toEqual(3);
      expect(result.totalSpent).toEqual(250);
    });

    it('should throw NotFoundException if customer profile does not exist', async () => {
      prismaService.customerProfile.findUnique.mockResolvedValue(null);

      await expect(service.getCustomerDashboardStats('user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCustomerProfile', () => {
    it('should update customer profile fields', async () => {
      prismaService.customerProfile.findUnique.mockResolvedValue({ id: 'cp-1', userId: 'user-1' });
      prismaService.customerProfile.update = jest.fn().mockResolvedValue({
        id: 'cp-1',
        userId: 'user-1',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '1234567890',
      });

      const result = await service.updateCustomerProfile('user-1', {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '1234567890',
      });

      expect(result.firstName).toEqual('Jane');
      expect(result.lastName).toEqual('Smith');
    });
  });
});
