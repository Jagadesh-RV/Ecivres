import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('active')
  async getActiveCoupons() {
    return this.couponsService.getActiveCoupons();
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllCoupons() {
    return this.couponsService.getAllCoupons();
  }

  @Post('validate')
  async validateCoupon(@Body() validateDto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(validateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCoupon(@Body() createDto: CreateCouponDto) {
    return this.couponsService.createCoupon(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  async deactivateCoupon(@Param('id') id: string) {
    return this.couponsService.deactivateCoupon(id);
  }
}
