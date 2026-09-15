import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MaintenanceTimelineService } from './maintenance-timeline.service';
import { EmergencyDispatchService, EmergencyDispatchRequest } from './emergency-dispatch.service';

@Controller('customers/super-app')
export class SuperAppController {
  constructor(
    private readonly timelineService: MaintenanceTimelineService,
    private readonly emergencyDispatch: EmergencyDispatchService,
  ) {}

  @Get('maintenance-timeline')
  getTimeline(@Query('customerId') customerId: string) {
    return this.timelineService.getCustomerTimeline(customerId || 'cust_demo');
  }

  @Post('emergency-dispatch')
  triggerEmergency(@Body() body: EmergencyDispatchRequest) {
    return this.emergencyDispatch.triggerPriorityDispatch(body);
  }
}
