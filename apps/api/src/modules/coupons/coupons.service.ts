import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCouponDto, DiscountType } from './dto/create-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

export interface CouponItem {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  validUntil?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class CouponsService {
  private coupons: CouponItem[] = [
    {
      id: 'coupon-1',
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minBookingAmount: 50,
      maxDiscount: 25,
      usedCount: 14,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: 'coupon-2',
      code: 'SAVE20',
      discountType: DiscountType.FIXED,
      discountValue: 20,
      minBookingAmount: 100,
      usedCount: 8,
      isActive: true,
      createdAt: new Date(),
    },
  ];

  async createCoupon(createDto: CreateCouponDto): Promise<CouponItem> {
    const existing = this.coupons.find(
      (c) => c.code.toUpperCase() === createDto.code.toUpperCase(),
    );
    if (existing) {
      throw new BadRequestException(`Coupon code '${createDto.code}' already exists`);
    }

    const newCoupon: CouponItem = {
      id: `coupon-${Date.now()}`,
      code: createDto.code.toUpperCase(),
      discountType: createDto.discountType,
      discountValue: createDto.discountValue,
      minBookingAmount: createDto.minBookingAmount,
      maxDiscount: createDto.maxDiscount,
      validUntil: createDto.validUntil,
      usageLimit: createDto.usageLimit,
      usedCount: 0,
      isActive: true,
      createdAt: new Date(),
    };

    this.coupons.push(newCoupon);
    return newCoupon;
  }

  async getActiveCoupons(): Promise<CouponItem[]> {
    return this.coupons.filter((c) => c.isActive);
  }

  async getAllCoupons(): Promise<CouponItem[]> {
    return this.coupons;
  }

  async validateCoupon(validateDto: ValidateCouponDto) {
    const coupon = this.coupons.find(
      (c) => c.code.toUpperCase() === validateDto.code.toUpperCase(),
    );

    if (!coupon || !coupon.isActive) {
      throw new NotFoundException('Invalid or expired promotional code');
    }

    if (coupon.minBookingAmount && validateDto.bookingAmount < coupon.minBookingAmount) {
      throw new BadRequestException(
        `Minimum booking amount for code ${coupon.code} is $${coupon.minBookingAmount}`,
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException(`Promotional code ${coupon.code} usage limit reached`);
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      throw new BadRequestException(`Promotional code ${coupon.code} has expired`);
    }

    let discountAmount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (validateDto.bookingAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalPrice = Math.max(0, validateDto.bookingAmount - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Number(discountAmount.toFixed(2)),
      originalAmount: validateDto.bookingAmount,
      finalAmount: Number(finalPrice.toFixed(2)),
    };
  }

  async deactivateCoupon(id: string): Promise<CouponItem> {
    const coupon = this.coupons.find((c) => c.id === id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID '${id}' not found`);
    }
    coupon.isActive = false;
    return coupon;
  }
}
