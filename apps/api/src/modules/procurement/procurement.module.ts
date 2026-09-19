import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { VendorContractService } from './services/vendor-contract.service';
import { ProcurementController } from './procurement.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProcurementController],
  providers: [VendorContractService],
  exports: [VendorContractService],
})
export class ProcurementModule {}
