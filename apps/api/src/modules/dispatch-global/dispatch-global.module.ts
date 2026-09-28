import { Module } from '@nestjs/common';
import { TimezoneSchedulerService } from './services/timezone-scheduler.service';
import { DispatchGlobalController } from './dispatch-global.controller';

@Module({
  controllers: [DispatchGlobalController],
  providers: [TimezoneSchedulerService],
  exports: [TimezoneSchedulerService],
})
export class DispatchGlobalModule {}
