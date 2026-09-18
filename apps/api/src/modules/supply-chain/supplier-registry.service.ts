import { Injectable, Logger } from '@nestjs/common';
import { OnboardSupplierDto } from './dto/onboard-supplier.dto';

export interface SupplierRecord {
  supplierId: string;
  supplierName: string;
  contactEmail: string;
  category: string;
  minimumOrderQuantity: number;
  status: 'VERIFIED' | 'PENDING';
  registeredAt: string;
}

@Injectable()
export class SupplierRegistryService {
  private readonly logger = new Logger(SupplierRegistryService.name);

  async registerSupplier(dto: OnboardSupplierDto): Promise<SupplierRecord> {
    const supplierId = `sup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.logger.log(`Registering new marketplace B2B supplier ${dto.supplierName} (${supplierId})`);

    return {
      supplierId,
      supplierName: dto.supplierName,
      contactEmail: dto.contactEmail,
      category: dto.category,
      minimumOrderQuantity: dto.minimumOrderQuantity,
      status: 'VERIFIED',
      registeredAt: new Date().toISOString(),
    };
  }
}
