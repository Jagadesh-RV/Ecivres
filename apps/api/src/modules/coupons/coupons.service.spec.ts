import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { DiscountType } from './dto/create-coupon.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CouponsService', () => {
  let service: CouponsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponsService],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new coupon successfully', async () => {
    const coupon = await service.createCoupon({
      code: 'FLASH50',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 50,
      minBookingAmount: 100,
    });

    expect(coupon).toBeDefined();
    expect(coupon.code).toBe('FLASH50');
    expect(coupon.discountValue).toBe(50);
  });

  it('should throw BadRequestException when creating a duplicate coupon code', async () => {
    await expect(
      service.createCoupon({
        code: 'WELCOME10',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should validate and calculate percentage discount correctly', async () => {
    const result = await service.validateCoupon({
      code: 'WELCOME10',
      bookingAmount: 100,
    });

    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(10);
    expect(result.finalAmount).toBe(90);
  });

  it('should validate and calculate fixed discount correctly', async () => {
    const result = await service.validateCoupon({
      code: 'SAVE20',
      bookingAmount: 150,
    });

    expect(result.valid).toBe(true);
    expect(result.discountAmount).toBe(20);
    expect(result.finalAmount).toBe(130);
  });

  it('should throw BadRequestException if booking amount is below minBookingAmount', async () => {
    await expect(
      service.validateCoupon({
        code: 'SAVE20',
        bookingAmount: 50,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException for non-existent coupon', async () => {
    await expect(
      service.validateCoupon({
        code: 'NONEXISTENT',
        bookingAmount: 100,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should deactivate a coupon', async () => {
    const deactivated = await service.deactivateCoupon('coupon-1');
    expect(deactivated.isActive).toBe(false);
  });
});
