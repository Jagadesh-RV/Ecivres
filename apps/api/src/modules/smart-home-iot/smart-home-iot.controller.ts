import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PredictiveMaintenanceService } from './services/predictive-maintenance.service';
import { RegisterSmartDeviceDto } from './dto/register-smart-device.dto';

@ApiTags('smart-home-iot')
@Controller('smart-home-iot')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SmartHomeIotController {
  constructor(private readonly iotService: PredictiveMaintenanceService) {}

  @Post('devices')
  @ApiOperation({ summary: 'Register smart home IoT telematics device' })
  async registerDevice(@Body() dto: RegisterSmartDeviceDto) {
    return this.iotService.registerDevice(dto.homeId, dto.deviceType, dto.telemetryTopic);
  }

  @Post('devices/:id/predictive-booking')
  @ApiOperation({ summary: 'Trigger automated predictive maintenance booking' })
  async triggerPredictiveBooking(@Param('id') id: string, @Body('errorMetric') errorMetric: string) {
    return this.iotService.triggerPredictiveBooking(id, errorMetric || 'PRESSURE_DROP');
  }
}
