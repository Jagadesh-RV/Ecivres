import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProviderProfileDto, UpdateProviderProfileDto } from './dto/provider-profile.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });
    
    if (!profile) {
      throw new NotFoundException('Provider profile not found');
    }

    return profile;
  }

  async createProfile(userId: string, createDto: CreateProviderProfileDto) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Provider profile already exists');
    }

    // Ensure the user also gets the PROVIDER role if they don't have it
    const role = await this.prisma.role.findUnique({ where: { name: 'PROVIDER' } });
    if (role) {
      await this.prisma.userRole.upsert({
        where: { userId_roleId: { userId, roleId: role.id } },
        create: { userId, roleId: role.id },
        update: {},
      });
    }

    return this.prisma.providerProfile.create({
      data: {
        userId,
        ...createDto,
      },
    });
  }

  async updateProfile(userId: string, updateDto: UpdateProviderProfileDto) {
    const existing = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.prisma.providerProfile.update({
      where: { userId },
      data: updateDto,
    });
  }
}
