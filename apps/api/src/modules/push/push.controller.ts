import { Controller, Post, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PushService } from './push.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@ApiTags('push')
@Controller('push')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('devices')
  @ApiOperation({ summary: 'Register FCM device token for push notifications' })
  async registerDevice(
    @CurrentUser() user: any,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.pushService.registerDevice(user.id, dto);
  }

  @Delete('devices/:token')
  @ApiOperation({ summary: 'Unregister FCM device token' })
  async unregisterDevice(
    @CurrentUser() user: any,
    @Param('token') token: string,
  ) {
    return this.pushService.unregisterDevice(user.id, token);
  }
}
