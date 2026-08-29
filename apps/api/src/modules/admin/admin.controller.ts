import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users with profiles (Admin only)' })
  async getUsers() {
    return this.adminService.findAllUsers();
  }

  @Patch('providers/:id/verify')
  @ApiOperation({ summary: 'Verify a provider profile (Admin only)' })
  async verifyProvider(@Param('id') providerProfileId: string) {
    return this.adminService.verifyProvider(providerProfileId);
  }
}
