import { Controller, Post, Body } from '@nestjs/common';
import { SuperAppService } from './superapp.service';
import { GenerateMaintenanceScheduleDto } from './dto/maintenance-schedule.dto';

@Controller('superapp')
export class SuperAppController {
  constructor(private readonly superAppService: SuperAppService) {}

  @Post('maintenance-plan')
  generatePlan(@Body() dto: GenerateMaintenanceScheduleDto) {
    return this.superAppService.generateMaintenancePlan(dto);
  }
}
