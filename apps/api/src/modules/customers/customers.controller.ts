import { Controller, Get, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CustomersService } from './customers.service';
import {
  CreateCustomerProfileDto,
  UpdateCustomerProfileDto,
} from './dto/customer-profile.dto';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current customer profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.customersService.getProfile(user.id);
  }

  @Post('profile')
  @ApiOperation({ summary: 'Create customer profile' })
  async createProfile(
    @CurrentUser() user: any,
    @Body() createDto: CreateCustomerProfileDto,
  ) {
    return this.customersService.createProfile(user.id, createDto);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update customer profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateCustomerProfileDto,
  ) {
    return this.customersService.updateProfile(user.id, updateDto);
  }
}
