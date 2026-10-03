import { Module } from '@nestjs/common';
import { CustomerLifecycleService } from './services/customer-lifecycle.service';
import { CustomerRetentionService } from './services/customer-retention.service';
import { CustomerReactivationService } from './services/customer-reactivation.service';
import { CustomerLifecycleController } from './customer-lifecycle.controller';

@Module({
  controllers: [CustomerLifecycleController],
  providers: [CustomerLifecycleService, CustomerRetentionService, CustomerReactivationService],
  exports: [CustomerLifecycleService, CustomerRetentionService, CustomerReactivationService],
})
export class CustomerLifecycleModule {}
