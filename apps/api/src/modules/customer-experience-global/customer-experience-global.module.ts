import { Module } from '@nestjs/common';
import { RegionalCustomerExperienceService } from './services/regional-customer-experience.service';
import { CustomerExperienceGlobalController } from './customer-experience-global.controller';

@Module({
  controllers: [CustomerExperienceGlobalController],
  providers: [RegionalCustomerExperienceService],
  exports: [RegionalCustomerExperienceService],
})
export class CustomerExperienceGlobalModule {}
