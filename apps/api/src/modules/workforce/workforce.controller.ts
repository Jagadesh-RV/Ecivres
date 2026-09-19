import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ShiftOptimizerService } from './services/shift-optimizer.service';
import { ScheduleShiftDto } from './dto/schedule-shift.dto';

@ApiTags('workforce')
@Controller('workforce')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkforceController {
  constructor(private readonly workforceService: ShiftOptimizerService) {}

  @Post('shifts')
  @ApiOperation({ summary: 'Schedule AI optimized staff shift' })
  async scheduleShift(@Body() dto: ScheduleShiftDto) {
    return this.workforceService.scheduleShift(dto.organizationId, dto.staffId, dto.startTime, dto.endTime, dto.overtimeHours);
  }

  @Get('overtime/predict')
  @ApiOperation({ summary: 'Predict staff overtime & burnout risk' })
  async predictOvertime(@Query('staffId') staffId: string, @Query('weeklyHours') weeklyHours: string) {
    return this.workforceService.predictOvertime(staffId, parseFloat(weeklyHours || '40'));
  }
}
