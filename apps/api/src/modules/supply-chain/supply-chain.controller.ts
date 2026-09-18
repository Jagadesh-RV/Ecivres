import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OnboardSupplierDto } from './dto/onboard-supplier.dto';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';
import { SupplierRegistryService } from './supplier-registry.service';
import { WarehouseInventoryService } from './warehouse-inventory.service';
import { DeliveryForecasterService } from './delivery-forecaster.service';

@Controller('supply-chain')
export class SupplyChainController {
  constructor(
    private readonly supplierRegistry: SupplierRegistryService,
    private readonly warehouseInventory: WarehouseInventoryService,
    private readonly deliveryForecaster: DeliveryForecasterService,
  ) {}

  @Post('suppliers')
  registerSupplier(@Body() dto: OnboardSupplierDto) {
    return this.supplierRegistry.registerSupplier(dto);
  }

  @Post('purchase-orders')
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.warehouseInventory.createPurchaseOrder(dto);
  }

  @Get('replenishment-forecast')
  forecastReplenishment(
    @Query('sku') sku: string,
    @Query('currentStock') currentStock: number,
    @Query('dailyBurn') dailyBurn: number,
  ) {
    return this.deliveryForecaster.forecastReplenishment(
      sku || 'SKU-TOOL-100',
      Number(currentStock) || 15,
      Number(dailyBurn) || 3,
    );
  }
}
