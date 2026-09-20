import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { SmartEscrowService } from './services/smart-escrow.service';
import { SmartContractsController } from './smart-contracts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SmartContractsController],
  providers: [SmartEscrowService],
  exports: [SmartEscrowService],
})
export class SmartContractsModule {}
