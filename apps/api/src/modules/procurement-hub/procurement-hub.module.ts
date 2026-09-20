import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PurchaseApprovalService } from './services/purchase-approval.service';
import { ProcurementHubController } from './procurement-hub.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProcurementHubController],
  providers: [PurchaseApprovalService],
  exports: [PurchaseApprovalService],
})
export class ProcurementHubModule {}
