import { Injectable, Logger } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';

export interface PurchaseOrderRecord {
  poId: string;
  supplierId: string;
  itemSku: string;
  quantity: number;
  unitPriceUsd: number;
  totalAmountUsd: number;
  status: 'SUBMITTED' | 'FULFILLED' | 'CANCELLED';
  orderedAt: string;
}

@Injectable()
export class WarehouseInventoryService {
  private readonly logger = new Logger(WarehouseInventoryService.name);

  async createPurchaseOrder(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderRecord> {
    const poId = `po_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const totalAmountUsd = Math.round((dto.quantity * dto.unitPriceUsd) * 100) / 100;

    this.logger.log(`Created purchase order ${poId} for SKU ${dto.itemSku} x ${dto.quantity}`);

    return {
      poId,
      supplierId: dto.supplierId,
      itemSku: dto.itemSku,
      quantity: dto.quantity,
      unitPriceUsd: dto.unitPriceUsd,
      totalAmountUsd,
      status: 'SUBMITTED',
      orderedAt: new Date().toISOString(),
    };
  }
}
