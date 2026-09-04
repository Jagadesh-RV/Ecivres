import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
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
    return fullUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/dashboard-stats')
  async getCustomerDashboardStats(@CurrentUser() user: any) {
    return this.usersService.getCustomerDashboardStats(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profiles/customer')
  async updateCustomerProfile(
    @CurrentUser() user: any,
    @Body() updateCustomerProfileDto: UpdateCustomerProfileDto,
  ) {
    return this.usersService.updateCustomerProfile(user.id, updateCustomerProfileDto);
  }

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

  @UseGuards(JwtAuthGuard)
  @Get('addresses')
  async getAddresses(@CurrentUser() user: any) {
    return this.usersService.getCustomerAddresses(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addresses')
  async addAddress(@CurrentUser() user: any, @Body() body: any) {
    return this.usersService.addCustomerAddress(user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('addresses/:id/delete')
  async deleteAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.usersService.deleteCustomerAddress(user.id, addressId);
  }
}
