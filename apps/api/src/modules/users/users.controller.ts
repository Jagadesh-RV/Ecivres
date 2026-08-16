import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    const fullUser = await this.usersService.findOneById(user.id);
    if (!fullUser) return null;
  @UseGuards(JwtAuthGuard)
  @Post('profiles/customer')
  async createCustomerProfile(
    @CurrentUser() user: any,
    @Body() body: { firstName: string; lastName: string; phone?: string },
  ) {
    return this.usersService.createCustomerProfile(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profiles/provider')
  async createProviderProfile(
    @CurrentUser() user: any,
    @Body()
    body: {
      businessName: string;
      description?: string;
      phone?: string;
      address?: string;
    },
  ) {
    return this.usersService.createProviderProfile(user.id, body);
  }
}
