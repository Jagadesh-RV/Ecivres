import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: { include: { role: true } },
        customerProfile: true,
        providerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;

    // Map roles for easier access on frontend
    const mappedResult = {
      ...result,
      roles: result.userRoles.filter((ur) => ur.role).map((ur) => ur.role.name),
      hasCustomerProfile: !!result.customerProfile,
      hasProviderProfile: !!result.providerProfile,
    };

    return mappedResult;
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async createCustomerProfile(
    userId: string,
    data: { firstName: string; lastName: string; phone?: string },
  ) {
    const existing = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new Error('Customer profile already exists');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: 'CUSTOMER' },
    });
    if (!role) {
      throw new Error('CUSTOMER role not found in database');
    }

    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.customerProfile.create({
        data: {
          userId,
          ...data,
        },
      });

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id,
          },
        },
        create: {
          userId,
          roleId: role.id,
        },
        update: {},
      });

      return profile;
    });
  }

  async createProviderProfile(
    userId: string,
    data: {
      businessName: string;
      description?: string;
      phone?: string;
      address?: string;
    },
  ) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      throw new Error('Provider profile already exists');
    }

    const role = await this.prisma.role.findUnique({
      where: { name: 'PROVIDER' },
    });
    if (!role) {
      throw new Error('PROVIDER role not found in database');
    }

    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.providerProfile.create({
        data: {
          userId,
          ...data,
        },
      });

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId: role.id,
          },
        },
        create: {
          userId,
          roleId: role.id,
        },
        update: {},
      });

      return profile;
    });
  }
}
