import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('collections')
  @ApiOperation({ summary: 'Get user collections' })
  async getCollections(@CurrentUser() user: any) {
    return this.wishlistService.getUserCollections(user.id);
  }

  @Post('collections')
  @ApiOperation({ summary: 'Create new wishlist collection' })
  async createCollection(@CurrentUser() user: any, @Body() body: { name: string; isPublic?: boolean }) {
    return this.wishlistService.createCollection(user.id, body.name, body.isPublic);
  }

  @Post('collections/:id/items')
  @ApiOperation({ summary: 'Add provider or service to collection' })
  async addItem(
    @CurrentUser() user: any,
    @Param('id') collectionId: string,
    @Body() body: { providerId?: string; serviceId?: string },
  ) {
    return this.wishlistService.addItemToCollection(user.id, collectionId, body);
  }
}
