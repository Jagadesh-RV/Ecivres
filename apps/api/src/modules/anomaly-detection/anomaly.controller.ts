import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AnomalyDetectionService } from './services/anomaly-detection.service';
import { AnomalyEventService } from './services/anomaly-event.service';
import { DetectAnomalyDto } from './dto/detect-anomaly.dto';
import { UpdateAnomalyStatusDto } from './dto/update-anomaly-status.dto';

@ApiTags('anomaly-detection')
@Controller('admin/anomalies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AnomalyController {
  constructor(
    private readonly detectionService: AnomalyDetectionService,
    private readonly eventService: AnomalyEventService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of marketplace anomalies' })
  async getAnomalies(@Query('status') status?: string, @Query('region') region?: string) {
    return this.eventService.getAnomalies(status, region);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Report a detected anomaly' })
  async detectAnomaly(@Body() dto: DetectAnomalyDto) {
    return this.eventService.createAnomaly(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update anomaly status (ACKNOWLEDGED, INVESTIGATING, RESOLVED, DISMISSED)' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateAnomalyStatusDto) {
    return this.eventService.updateStatus(id, dto);
  }
}
