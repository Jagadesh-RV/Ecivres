import { Test, TestingModule } from '@nestjs/testing';
import { SupplierRegistryService } from './supplier-registry.service';
import { WarehouseInventoryService } from './warehouse-inventory.service';
import { DeliveryForecasterService } from './delivery-forecaster.service';

describe('Supply Chain Module Services', () => {
  let supplierRegistry: SupplierRegistryService;
  let warehouseInventory: WarehouseInventoryService;
  let deliveryForecaster: DeliveryForecasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierRegistryService, WarehouseInventoryService, DeliveryForecasterService],
    }).compile();

    supplierRegistry = module.get<SupplierRegistryService>(SupplierRegistryService);
    warehouseInventory = module.get<WarehouseInventoryService>(WarehouseInventoryService);
    deliveryForecaster = module.get<DeliveryForecasterService>(DeliveryForecasterService);
  });

  it('should register B2B supplier', async () => {
    const res = await supplierRegistry.registerSupplier({
      supplierName: 'Fasteners & Plumbing Co',
      contactEmail: 'sales@fasteners.com',
      category: 'Plumbing Parts',
      minimumOrderQuantity: 50,
    });
    expect(res.supplierId).toBeDefined();
    expect(res.status).toBe('VERIFIED');
  });

  it('should create purchase order and compute total price', async () => {
    const res = await warehouseInventory.createPurchaseOrder({
      supplierId: 'sup_100',
      itemSku: 'SKU-VALVE-50',
      quantity: 100,
      unitPriceUsd: 12.5,
    });
    expect(res.poId).toBeDefined();
    expect(res.totalAmountUsd).toBe(1250);
    expect(res.status).toBe('SUBMITTED');
  });

  it('should flag replenishment needed when stock days remaining <= 7', () => {
    const res = deliveryForecaster.forecastReplenishment('SKU-VALVE-50', 10, 3);
    // 10 stock / 3 burn per day = 3 days remaining -> needs replenishment
    expect(res.needsReplenishment).toBe(true);
    expect(res.recommendedOrderQuantity).toBe(90);
  });
});
