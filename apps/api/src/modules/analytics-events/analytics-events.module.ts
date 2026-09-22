import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventCollectorService } from './services/event-collector.service';
import { AnalyticsEventsController } from './analytics-events.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyticsEventsController],
  providers: [EventCollectorService],
  exports: [EventCollectorService],
})
export class AnalyticsEventsModule {}
