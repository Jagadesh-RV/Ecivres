import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceQueryDto } from './dto/service-query.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createServiceDto: CreateServiceDto) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId }
    });

    if (!providerProfile) {
      throw new ForbiddenException('Only registered providers can create services');
    }

    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        providerId: providerProfile.id,
      },
    });
  }

  async findAll(query: ServiceQueryDto = {}) {
    const { categoryId, providerId, minPrice, maxPrice, search, sortBy } = query;
    
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (providerId) where.providerId = providerId;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };

    return this.prisma.service.findMany({
      where,
      orderBy,
      include: {
        category: true,
        provider: {
          select: { id: true, businessName: true, phone: true, isVerified: true, user: { select: { email: true } } }
        }
      }
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        provider: true,
      }
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, userId: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.findOne(id);
    
    if (service.provider.userId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: string, userId: string) {
    const service = await this.findOne(id);
    
    if (service.provider.userId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
