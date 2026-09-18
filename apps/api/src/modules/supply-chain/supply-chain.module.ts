import { Module } from '@nestjs/common';
import { SupplierRegistryService } from './supplier-registry.service';
import { WarehouseInventoryService } from './warehouse-inventory.service';
import { DeliveryForecasterService } from './delivery-forecaster.service';
import { SupplyChainController } from './supply-chain.controller';

@Module({
  controllers: [SupplyChainController],
  providers: [SupplierRegistryService, WarehouseInventoryService, DeliveryForecasterService],
  exports: [SupplierRegistryService, WarehouseInventoryService, DeliveryForecasterService],
})
export class SupplyChainModule {}
