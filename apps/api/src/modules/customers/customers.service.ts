import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerProfileDto, UpdateCustomerProfileDto } from './dto/customer-profile.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      throw new NotFoundException('Customer profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, createDto: CreateCustomerProfileDto) {
    const existing = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Customer profile already exists');
    }

    // Ensure the user also gets the CUSTOMER role if they don't have it
    const role = await this.prisma.role.findUnique({ where: { name: 'CUSTOMER' } });
    if (role) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }

    return this.prisma.customerProfile.create({
      data: {
        userId,
        ...createDto,
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateCustomerProfileDto) {
    const existing = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Customer profile not found');
    }

    return this.prisma.customerProfile.update({
      where: { userId },
      data: updateDto,
    });
  }
}
