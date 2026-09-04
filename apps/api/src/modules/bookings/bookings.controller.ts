import { Controller, Post, Body, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking' })
  async create(
    @CurrentUser() user: any,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user bookings' })
  async findAll(@CurrentUser() user: any) {
    return this.bookingsService.findAllForCustomer(user.id);
  }

  @Get('provider')
  @UseGuards(RolesGuard)
  @Roles('PROVIDER')
  @ApiOperation({ summary: 'Get current provider bookings' })
  async findAllForProvider(@CurrentUser() user: any) {
    return this.bookingsService.findAllForProvider(user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('PROVIDER')
  @ApiOperation({ summary: 'Update booking status (Provider only)' })
  async updateStatus(
    @CurrentUser() user: any,
    @Param('id') bookingId: string,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(bookingId, user.id, updateBookingStatusDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (Customer only)' })
  async cancel(
    @CurrentUser() user: any,
    @Param('id') bookingId: string,
    @Body() cancelBookingDto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(bookingId, user.id, cancelBookingDto?.reason);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a booking to a new scheduled date/time' })
  async reschedule(
    @CurrentUser() user: any,
    @Param('id') bookingId: string,
    @Body() body: { scheduledAt: string },
  ) {
    return this.bookingsService.rescheduleBooking(bookingId, user.id, body.scheduledAt);
  }
}
