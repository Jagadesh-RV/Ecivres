import { Module } from '@nestjs/common';
import { EquipmentInventoryService } from './equipment-inventory.service';
import { BusinessOsController } from './business-os.controller';

@Module({
  controllers: [BusinessOsController],
  providers: [EquipmentInventoryService],
  exports: [EquipmentInventoryService],
})
export class BusinessOsModule {}
