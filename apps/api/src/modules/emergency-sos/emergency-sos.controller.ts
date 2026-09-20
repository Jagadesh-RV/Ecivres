import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PriorityDispatchService } from './services/priority-dispatch.service';
import { DispatchSosDto } from './dto/dispatch-sos.dto';

@ApiTags('emergency-sos')
@Controller('emergency-sos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmergencySosController {
  constructor(private readonly dispatchService: PriorityDispatchService) {}

  @Post('dispatch')
  @ApiOperation({ summary: 'Dispatch rapid priority SOS emergency booking' })
  async dispatchSos(@Body() dto: DispatchSosDto) {
    return this.dispatchService.dispatchSos(dto.customerId, dto.serviceCategory, dto.latitude, dto.longitude);
  }

  @Get(':id/tracking')
  @ApiOperation({ summary: 'Track live emergency responder ETA and geolocation' })
  async trackResponder(@Param('id') id: string) {
    return this.dispatchService.trackResponder(id);
  }
}
