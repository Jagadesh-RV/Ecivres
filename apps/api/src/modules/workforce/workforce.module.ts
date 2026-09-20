import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ShiftOptimizerService } from './services/shift-optimizer.service';
import { WorkforceController } from './workforce.controller';

@Module({
  imports: [PrismaModule],
  controllers: [WorkforceController],
  providers: [ShiftOptimizerService],
  exports: [ShiftOptimizerService],
})
export class WorkforceModule {}
