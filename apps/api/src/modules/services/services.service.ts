import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: string) {
    const where = categoryId ? { categoryId } : {};
    return this.prisma.service.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            isVerified: true,
            userId: true, // Safe public data
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        provider: {
          select: {
            id: true,
            businessName: true,
            description: true,
            phone: true,
            address: true,
            isVerified: true,
            userId: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async create(userId: string, createDto: CreateServiceDto) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new BadRequestException('User does not have a provider profile');
    }

    return this.prisma.service.create({
      data: {
        ...createDto,
        providerId: provider.id,
      },
    });
  }

  async update(userId: string, id: string, updateDto: UpdateServiceDto) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new ForbiddenException('User does not have a provider profile');
    }

    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (service.providerId !== provider.id) {
      throw new ForbiddenException('You do not own this service');
    }

    return this.prisma.service.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(userId: string, id: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new ForbiddenException('User does not have a provider profile');
    }

    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (service.providerId !== provider.id) {
      throw new ForbiddenException('You do not own this service');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
