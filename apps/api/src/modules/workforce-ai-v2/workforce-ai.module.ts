import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WorkforceForecasterService } from './services/workforce-forecaster.service';
import { WorkforceAiController } from './workforce-ai.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WorkforceAiController],
  providers: [WorkforceForecasterService],
  exports: [WorkforceForecasterService],
})
export class WorkforceAiModule {}
