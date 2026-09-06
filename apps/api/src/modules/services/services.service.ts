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
    if (sortBy === 'price_asc' || sortBy === 'PRICE_ASC') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc' || sortBy === 'PRICE_DESC') orderBy = { price: 'desc' };

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

  async searchServices(dto: any) {
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (dto.categoryId) where.categoryId = dto.categoryId;
    if (dto.providerId) where.providerId = dto.providerId;

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where.price = {};
      if (dto.minPrice !== undefined) where.price.gte = Number(dto.minPrice);
      if (dto.maxPrice !== undefined) where.price.lte = Number(dto.maxPrice);
    }

    if (dto.query) {
      where.OR = [
        { name: { contains: dto.query, mode: 'insensitive' } },
        { description: { contains: dto.query, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (dto.sortBy === 'price_asc' || dto.sortBy === 'PRICE_ASC') orderBy = { price: 'asc' };
    if (dto.sortBy === 'price_desc' || dto.sortBy === 'PRICE_DESC') orderBy = { price: 'desc' };

    const [items, totalItems] = await Promise.all([
      this.prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          provider: {
            select: { id: true, businessName: true, phone: true, isVerified: true, user: { select: { email: true } } }
          }
        }
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      items,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit) || 1,
    };
  }
}
