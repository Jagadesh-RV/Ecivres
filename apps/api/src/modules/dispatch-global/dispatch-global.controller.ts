import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TimezoneSchedulerService } from './services/timezone-scheduler.service';

@ApiTags('dispatch-global')
@Controller('dispatch-global')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DispatchGlobalController {
  constructor(private readonly timezoneScheduler: TimezoneSchedulerService) {}

  @Get('timezone/:countryCode')
  @ApiOperation({ summary: 'Get country IANA timezone string' })
  async getTimezone(@Param('countryCode') countryCode: string) {
    return { timezone: this.timezoneScheduler.getCountryTimezone(countryCode) };
  }

  @Post('check-working-hours')
  @ApiOperation({ summary: 'Check if current hour is within regional working hours' })
  async checkWorkingHours(@Body() body: { localHour: number; countryCode: string }) {
    return { isWithinWorkingHours: this.timezoneScheduler.isWithinWorkingHours(body.localHour, body.countryCode) };
  }

  @Get('check-holiday')
  @ApiOperation({ summary: 'Check if date is a regional holiday' })
  async checkHoliday(@Query('countryCode') countryCode: string, @Query('isoDate') isoDate: string) {
    return { isHoliday: this.timezoneScheduler.isRegionalHoliday(countryCode, isoDate) };
  }
}
