import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getUserFavorites(@Request() req: any) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Post('toggle')
  async toggleFavorite(@Request() req: any, @Body() dto: ToggleFavoriteDto) {
    return this.favoritesService.toggleFavorite(req.user.id, dto.serviceId);
  }

  @Get('check/:serviceId')
  async checkIsFavorite(@Request() req: any, @Param('serviceId') serviceId: string) {
    return this.favoritesService.checkIsFavorite(req.user.id, serviceId);
  }
}
