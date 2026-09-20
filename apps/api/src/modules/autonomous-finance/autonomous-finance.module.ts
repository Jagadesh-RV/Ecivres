import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AutomatedSettlementService } from './services/automated-settlement.service';
import { AutonomousFinanceController } from './autonomous-finance.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AutonomousFinanceController],
  providers: [AutomatedSettlementService],
  exports: [AutomatedSettlementService],
})
export class AutonomousFinanceModule {}
