import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WorkforceForecasterService } from './services/workforce-forecaster.service';
import { OptimizeWorkforceScheduleDto } from './dto/optimize-workforce-schedule.dto';

@ApiTags('workforce-ai-v2')
@Controller('workforce-ai-v2')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkforceAiController {
  constructor(private readonly forecasterService: WorkforceForecasterService) {}

  @Post('schedules/optimize')
  @ApiOperation({ summary: 'Optimize AI staff workforce schedule' })
  async optimizeSchedule(@Body() dto: OptimizeWorkforceScheduleDto) {
    return this.forecasterService.optimizeSchedule(dto.organizationId, dto.weekNumber);
  }

  @Get('organizations/:id/forecast')
  @ApiOperation({ summary: 'Generate AI labor demand & staffing forecast' })
  async getForecast(@Param('id') id: string) {
    return this.forecasterService.getWorkforceForecast(id);
  }
}
