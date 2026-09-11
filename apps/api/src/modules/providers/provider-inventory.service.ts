import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface InventoryItem {
  id: string;
  providerId: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unitCost: number;
}

export interface ExpenseRecord {
  id: string;
  providerId: string;
  title: string;
  amount: number;
  category: 'EQUIPMENT' | 'SUPPLIES' | 'TRAVEL' | 'MARKETING' | 'OTHER';
  date: Date;
}

@Injectable()
export class ProviderInventoryService {
  private inventoryStore: Map<string, InventoryItem[]> = new Map();
  private expenseStore: Map<string, ExpenseRecord[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async addInventoryItem(
    providerId: string,
    dto: { name: string; sku?: string; category: string; quantity: number; minThreshold: number; unitCost: number },
  ): Promise<InventoryItem> {
    const list = this.inventoryStore.get(providerId) || [];
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      name: dto.name,
      sku: dto.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: dto.category,
      quantity: dto.quantity,
      minThreshold: dto.minThreshold,
      unitCost: dto.unitCost,
    };
    list.push(newItem);
    this.inventoryStore.set(providerId, list);
    return newItem;
  }

  async getInventory(providerId: string): Promise<InventoryItem[]> {
    return this.inventoryStore.get(providerId) || [];
  }

  async logExpense(
    providerId: string,
    dto: { title: string; amount: number; category: ExpenseRecord['category'] },
  ): Promise<ExpenseRecord> {
    const list = this.expenseStore.get(providerId) || [];
    const newExpense: ExpenseRecord = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      providerId,
      title: dto.title,
      amount: dto.amount,
      category: dto.category,
      date: new Date(),
    };
    list.push(newExpense);
    this.expenseStore.set(providerId, list);
    return newExpense;
  }

  async calculateTaxEstimate(providerId: string, taxRate: number = 0.20): Promise<{ grossRevenue: number; totalExpenses: number; taxableIncome: number; estimatedTax: number }> {
    const expenses = this.expenseStore.get(providerId) || [];
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Mock revenue lookup or fetch from bookings
    const bookings = await this.prisma.booking.findMany({
      where: { providerId, status: 'COMPLETED' },
    });
    const grossRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const taxableIncome = Math.max(0, grossRevenue - totalExpenses);
    const estimatedTax = Math.round(taxableIncome * taxRate);

    return {
      grossRevenue,
      totalExpenses,
      taxableIncome,
      estimatedTax,
    };
  }
}
