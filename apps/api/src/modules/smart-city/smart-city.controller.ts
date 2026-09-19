import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MunicipalRequestDto } from './dto/municipal-request.dto';
import { MunicipalDispatchService } from './municipal-dispatch.service';
import { InfrastructureMonitorService } from './infrastructure-monitor.service';

@Controller('smart-city')
export class SmartCityController {
  constructor(
    private readonly municipalDispatch: MunicipalDispatchService,
    private readonly infrastructureMonitor: InfrastructureMonitorService,
  ) {}

  @Post('municipal-request')
  triageRequest(@Body() dto: MunicipalRequestDto) {
    return this.municipalDispatch.triageAndDispatch(dto);
  }

  @Get('infrastructure-health')
  getHealth(@Query('cityId') cityId: string) {
    return this.infrastructureMonitor.getCityInfrastructureHealth(cityId || 'city_seattle');
  }
}
