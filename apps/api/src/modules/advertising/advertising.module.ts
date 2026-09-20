import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdBiddingService } from './services/ad-bidding.service';
import { AdvertisingController } from './advertising.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdvertisingController],
  providers: [AdBiddingService],
  exports: [AdBiddingService],
})
export class AdvertisingModule {}
