import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review (Customer only)' })
  create(@Request() req: any, @Body() createDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createDto);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get all reviews for a specific service' })
  findByService(@Param('serviceId') serviceId: string) {
    return this.reviewsService.findByService(serviceId);
  }

  @Get('provider/:providerId/stats')
  @ApiOperation({ summary: 'Get review stats for a provider' })
  getProviderStats(@Param('providerId') providerId: string) {
    return this.reviewsService.getProviderStats(providerId);
  }
}
